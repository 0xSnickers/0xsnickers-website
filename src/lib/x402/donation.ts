import type { SettleResponse } from '@x402/core/types';
import type { DonationTier } from '@/lib/x402/shared';

export type DonationRecord = {
  id: string;
  request_id: string;
  tier: DonationTier;
  amount: string;
  currency: string;
  chain: string;
  tx_hash: string | null;
  payer_address: string | null;
  receiver_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  verified_at: string | null;
  created_at: string;
};

export type DonationResponse = {
  success: true;
  donation: {
    id: string;
    requestId: string;
    tier: DonationTier;
    amount: string;
    currency: string;
    chain: string;
    txHash: string | null;
    payerAddress: string | null;
    receiverAddress: string;
    status: DonationRecord['status'];
    createdAt: string;
  };
};

export function toDonationResponse(row: DonationRecord): DonationResponse {
  return {
    success: true,
    donation: {
      id: row.id,
      requestId: row.request_id,
      tier: row.tier,
      amount: row.amount,
      currency: row.currency,
      chain: row.chain,
      txHash: row.tx_hash,
      payerAddress: row.payer_address,
      receiverAddress: row.receiver_address,
      status: row.status,
      createdAt: row.created_at,
    },
  };
}

export function getPaymentSummary(result: SettleResponse) {
  return {
    txHash: result.transaction || null,
    payerAddress: result.payer || null,
    amount: result.amount || null,
    network: result.network,
    raw: result,
  };
}

export function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function isUuid(value: string | null | undefined): value is string {
  return Boolean(
    value
      && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
  );
}
