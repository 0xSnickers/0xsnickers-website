import type { Network } from '@x402/core/types';
import {
  DEFAULT_X402_NETWORK,
  DONATION_TIER_KEYS,
  DONATION_TIERS,
  getDonationTier,
  isDonationTier,
  type DonationTier,
} from '@/lib/x402/shared';

export { DEFAULT_X402_NETWORK, DONATION_TIER_KEYS, DONATION_TIERS, getDonationTier, isDonationTier };
export type { DonationTier, DonationTierConfig } from '@/lib/x402/shared';

export function getX402Network(): Network {
  return (process.env.X402_NETWORK || process.env.NEXT_PUBLIC_X402_NETWORK || DEFAULT_X402_NETWORK) as Network;
}

export function getX402FacilitatorUrl() {
  return process.env.X402_FACILITATOR_URL || 'https://facilitator.x402.org';
}

export function getX402ReceiverAddress() {
  return process.env.X402_RECEIVER_ADDRESS?.trim();
}

export function getDonationPrice(tier: DonationTier) {
  return `$${DONATION_TIERS[tier].amount}`;
}

export function getDonationConfigError() {
  const serverNetwork = getX402Network();
  const clientNetwork = process.env.NEXT_PUBLIC_X402_NETWORK || DEFAULT_X402_NETWORK;

  if (!getX402ReceiverAddress()) {
    return 'Missing X402_RECEIVER_ADDRESS.';
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return 'Missing NEXT_PUBLIC_SUPABASE_URL.';
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return 'Missing SUPABASE_SERVICE_ROLE_KEY.';
  }

  if (clientNetwork !== serverNetwork) {
    return 'NEXT_PUBLIC_X402_NETWORK must match X402_NETWORK.';
  }

  return null;
}
