import { HTTPFacilitatorClient } from '@x402/core/server';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import {
  withX402FromHTTPServer,
  x402HTTPResourceServer,
  x402ResourceServer,
  type RouteConfig,
} from '@x402/next';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  DONATION_TIERS,
  getDonationConfigError,
  getDonationPrice,
  getX402FacilitatorUrl,
  getX402Network,
  getX402ReceiverAddress,
  isDonationTier,
  type DonationTier,
} from '@/lib/x402/config';
import {
  getPaymentSummary,
  getQueryValue,
  isUuid,
  toDonationResponse,
  type DonationRecord,
} from '@/lib/x402/donation';

export const runtime = 'nodejs';

type QueryReader = {
  getQueryParam(name: string): string | string[] | undefined;
};

function readQueryValue(context: unknown, key: string) {
  const adapter = (context as { adapter?: QueryReader } | undefined)?.adapter;
  return getQueryValue(adapter?.getQueryParam(key));
}

function readRequestParts(request: NextRequest) {
  const tier = request.nextUrl.searchParams.get('tier');
  const requestId = request.nextUrl.searchParams.get('requestId');

  return {
    tier,
    requestId,
  };
}

function getValidRequestParts(request: NextRequest) {
  const { tier, requestId } = readRequestParts(request);

  if (!isDonationTier(tier)) {
    return { error: 'Invalid donation tier.' };
  }

  if (!isUuid(requestId)) {
    return { error: 'Invalid requestId.' };
  }

  return {
    tier,
    requestId,
  };
}

async function findDonationByRequestId(requestId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('donations')
    .select('id, request_id, tier, amount, currency, chain, tx_hash, payer_address, receiver_address, status, verified_at, created_at')
    .eq('request_id', requestId)
    .maybeSingle<DonationRecord>();

  if (error) {
    throw error;
  }

  return data;
}

function createRouteConfig(): RouteConfig {
  const receiverAddress = getX402ReceiverAddress();

  if (!receiverAddress) {
    throw new Error('Missing X402_RECEIVER_ADDRESS.');
  }

  return {
    accepts: {
      scheme: 'exact',
      payTo: receiverAddress,
      price: (context) => {
        const tier = readQueryValue(context, 'tier');

        if (!isDonationTier(tier)) {
          throw new Error('Invalid donation tier.');
        }

        return getDonationPrice(tier);
      },
      network: getX402Network(),
      maxTimeoutSeconds: 60,
    },
    description: 'Support 0xsnickers with USDC.',
    serviceName: '0xsnickers.lol donations',
    tags: ['donation', 'x402', 'USDC'],
    unpaidResponseBody: () => ({
      contentType: 'application/json',
      body: {
        success: false,
        error: 'Payment required.',
      },
    }),
    settlementFailedResponseBody: (_context, settleResult) => ({
      contentType: 'application/json',
      body: {
        success: false,
        error: settleResult.errorMessage || settleResult.errorReason || 'Payment settlement failed.',
      },
    }),
  };
}

function createConfiguredHandler() {
  const facilitatorClient = new HTTPFacilitatorClient({
    url: getX402FacilitatorUrl(),
  });

  async function markDonationFailed(requestId: string, payload: Record<string, unknown>) {
    const supabase = createSupabaseServerClient();

    await supabase
      .from('donations')
      .update({
        status: 'failed',
        facilitator_response: payload,
        verified_at: null,
      })
      .eq('request_id', requestId)
      .eq('status', 'pending');
  }

  const resourceServer = new x402ResourceServer(facilitatorClient)
    .register(getX402Network(), new ExactEvmScheme())
    .onAfterSettle(async (context) => {
      const requestId = readQueryValue(context.transportContext, 'requestId');

      if (!requestId || !isUuid(requestId)) {
        return;
      }

      const payment = getPaymentSummary(context.result);
      const supabase = createSupabaseServerClient();

      await supabase
        .from('donations')
        .update({
          status: 'confirmed',
          tx_hash: payment.txHash,
          payer_address: payment.payerAddress,
          facilitator_response: payment.raw,
          verified_at: new Date().toISOString(),
        })
        .eq('request_id', requestId)
        .eq('status', 'pending');
    })
    .onSettleFailure(async (context) => {
      const requestId = readQueryValue(context.transportContext, 'requestId');

      if (!requestId || !isUuid(requestId)) {
        return;
      }

      await markDonationFailed(requestId, {
        phase: 'settle',
        error: context.error.message,
      });
    })
    .onVerifiedPaymentCanceled(async (context) => {
      const requestId = readQueryValue(context.transportContext, 'requestId');

      if (!requestId || !isUuid(requestId)) {
        return;
      }

      await markDonationFailed(requestId, {
        phase: 'handler',
        reason: context.reason,
        responseStatus: context.responseStatus ?? null,
        error: context.error instanceof Error ? context.error.message : null,
      });
    });

  const httpServer = new x402HTTPResourceServer(resourceServer, createRouteConfig())
    .onProtectedRequest(async (context) => {
      const tier = readQueryValue(context, 'tier');
      const requestId = readQueryValue(context, 'requestId');

      if (!isDonationTier(tier) || !isUuid(requestId)) {
        return {
          abort: true,
          reason: 'Invalid donation request.',
        };
      }

      const existing = await findDonationByRequestId(requestId);

      if (existing?.status === 'confirmed') {
        return { grantAccess: true };
      }

      if (existing?.status === 'pending') {
        return {
          abort: true,
          reason: 'Donation request is already processing.',
        };
      }

      return undefined;
    });

  const handler = async (request: NextRequest): Promise<NextResponse> => {
    const parts = getValidRequestParts(request);

    if ('error' in parts) {
      return NextResponse.json({ success: false, error: parts.error }, { status: 400 });
    }

    const tierConfig = DONATION_TIERS[parts.tier as DonationTier];
    const receiverAddress = getX402ReceiverAddress();

    if (!receiverAddress) {
      return NextResponse.json({ success: false, error: 'Donation receiver is not configured.' }, { status: 503 });
    }

    const existing = await findDonationByRequestId(parts.requestId);

    if (existing) {
      if (existing.status === 'failed') {
        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from('donations')
          .update({
            tier: parts.tier,
            amount: tierConfig.amount,
            currency: 'USDC',
            chain: getX402Network(),
            tx_hash: null,
            payer_address: null,
            receiver_address: receiverAddress,
            facilitator_response: null,
            status: 'pending',
            verified_at: null,
          })
          .eq('request_id', parts.requestId)
          .select('id, request_id, tier, amount, currency, chain, tx_hash, payer_address, receiver_address, status, verified_at, created_at')
          .single<DonationRecord>();

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json(toDonationResponse(data));
      }

      return NextResponse.json(toDonationResponse(existing));
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('donations')
      .insert({
        request_id: parts.requestId,
        tier: parts.tier,
        amount: tierConfig.amount,
        currency: 'USDC',
        chain: getX402Network(),
        receiver_address: receiverAddress,
        status: 'pending',
      })
      .select('id, request_id, tier, amount, currency, chain, tx_hash, payer_address, receiver_address, status, verified_at, created_at')
      .single<DonationRecord>();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(toDonationResponse(data));
  };

  return withX402FromHTTPServer(handler, httpServer);
}

let configuredHandler: ReturnType<typeof createConfiguredHandler> | null = null;

export async function POST(request: NextRequest) {
  const configError = getDonationConfigError();

  if (configError) {
    return NextResponse.json({ success: false, error: configError }, { status: 503 });
  }

  configuredHandler ??= createConfiguredHandler();

  return configuredHandler(request);
}
