'use client';

import { decodePaymentResponseHeader, wrapFetchWithPaymentFromConfig } from '@x402/fetch';
import type { Network } from '@x402/core/types';
import { ExactEvmScheme } from '@x402/evm';
import { CheckCircle2, Heart, Loader2, Wallet } from 'lucide-react';
import { createWalletClient, custom, type EIP1193Provider } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { useMemo, useState } from 'react';
import { DEFAULT_X402_NETWORK, DONATION_TIER_KEYS, DONATION_TIERS, type DonationTier } from '@/lib/x402/shared';

type PaymentStatus = 'idle' | 'connecting' | 'paying' | 'success' | 'error' | 'requires-payment-client';

type EthereumProvider = EIP1193Provider & {
  request(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const CLIENT_X402_NETWORK = (process.env.NEXT_PUBLIC_X402_NETWORK || DEFAULT_X402_NETWORK) as Network;

const SUPPORTED_CHAINS = {
  'eip155:84532': baseSepolia,
  'eip155:8453': base,
} as const;

function getClientChain() {
  const chain = SUPPORTED_CHAINS[CLIENT_X402_NETWORK as keyof typeof SUPPORTED_CHAINS];

  if (!chain) {
    throw new Error(`Unsupported client x402 network: ${CLIENT_X402_NETWORK}.`);
  }

  return chain;
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Payment failed. Please try again.';
}

function createRequestId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function ensurePaymentChain(provider: EthereumProvider) {
  const chain = getClientChain();
  const chainId = `0x${chain.id.toString(16)}`;

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? (error as { code?: number }).code
      : undefined;

    if (code !== 4902) {
      throw error;
    }

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: [...chain.rpcUrls.default.http],
          blockExplorerUrls: chain.blockExplorers?.default
            ? [chain.blockExplorers.default.url]
            : [],
        },
      ],
    });
  }
}

export function DonateForm() {
  const [selectedTier, setSelectedTier] = useState<DonationTier>('coffee');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const selected = DONATION_TIERS[selectedTier];
  const chain = getClientChain();

  const statusText = useMemo(() => {
    if (status === 'connecting') return 'Connecting wallet...';
    if (status === 'paying') return 'Waiting for wallet signature and settlement...';
    if (status === 'success') return `You just sent ${selected.amount} USDC. Thank you for the support.`;
    if (status === 'requires-payment-client') {
      return 'The API returned x402 payment requirements. Please use an x402-capable wallet/client to finish this payment.';
    }
    if (status === 'error') return errorMessage;
    return `Pick a tier and settle with USDC on ${chain.name}.`;
  }, [chain.name, errorMessage, selected.amount, status]);

  async function handleDonate() {
    setStatus('connecting');
    setErrorMessage('');
    setTxHash(null);

    try {
      const provider = window.ethereum;

      if (!provider) {
        setStatus('requires-payment-client');
        return;
      }

      await ensurePaymentChain(provider);

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const account = Array.isArray(accounts) && typeof accounts[0] === 'string'
        ? accounts[0] as `0x${string}`
        : null;

      if (!account) {
        throw new Error('No wallet account selected.');
      }

      const walletClient = createWalletClient({
        account,
        chain,
        transport: custom(provider),
      });

      const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
        schemes: [
          {
            network: CLIENT_X402_NETWORK,
            client: new ExactEvmScheme({
              address: account,
              signTypedData: (message) => walletClient.signTypedData({
                account,
                domain: message.domain,
                types: message.types,
                primaryType: message.primaryType,
                message: message.message,
              }),
            }),
          },
        ],
      });

      setStatus('paying');

      const requestId = createRequestId();
      const params = new URLSearchParams({
        tier: selectedTier,
        requestId,
      });
      const response = await fetchWithPayment(`/api/donations?${params.toString()}`, {
        method: 'POST',
      });

      if (response.status === 402) {
        setStatus('requires-payment-client');
        return;
      }

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        throw new Error(body?.error || 'Donation failed.');
      }

      const paymentResponse = response.headers.get('PAYMENT-RESPONSE');
      if (paymentResponse) {
        const decoded = decodePaymentResponseHeader(paymentResponse);
        setTxHash(decoded.transaction || null);
      } else {
        setTxHash(body.donation?.txHash || null);
      }

      setStatus('success');
    } catch (error) {
      setErrorMessage(formatError(error));
      setStatus('error');
    }
  }

  const isBusy = status === 'connecting' || status === 'paying';

  return (
    <div className="rounded-[28px] border border-white/55 bg-white/70 p-5 shadow-[0_24px_70px_rgba(14,165,233,0.16)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/75 px-3.5 py-2 text-sm font-semibold text-primary shadow-sm">
        <Heart className="h-4 w-4" />
        USDC on {chain.name}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {DONATION_TIER_KEYS.map((tier) => {
          const item = DONATION_TIERS[tier];
          const selectedItem = selectedTier === tier;

          return (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`group min-h-32 rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                selectedItem
                  ? 'border-primary/35 bg-sky-50 text-text shadow-[0_14px_34px_rgba(14,165,233,0.16)]'
                  : 'border-white/65 bg-white/78 text-text/75 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="block text-[2rem] font-bold leading-none tracking-[-0.04em] text-text">${Number(item.amount)}</span>
              <span className="mt-3 block text-sm font-semibold leading-6 text-primary">{item.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleDonate}
        disabled={isBusy}
        className="mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-base font-bold text-white shadow-[0_14px_34px_rgba(14,165,233,0.28)] transition-all duration-200 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wallet className="h-5 w-5" />}
        Treat me to {selected.amount} USDC
      </button>

      <div
        className={`mt-5 rounded-2xl border px-4 py-3 text-sm leading-6 ${
          status === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : status === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-border/60 bg-white/65 text-text/65'
        }`}
      >
        <div className="flex items-start gap-2">
          {status === 'success' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
          <p>{statusText}</p>
        </div>
        {txHash && (
          <p className="mt-2 break-all text-xs text-emerald-700/80">
            Transaction: {txHash}
          </p>
        )}
      </div>
    </div>
  );
}
