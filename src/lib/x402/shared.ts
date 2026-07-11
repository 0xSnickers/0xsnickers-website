import type { Network } from '@x402/core/types';

export const DONATION_TIERS = {
  coffee: {
    label: 'Buy me a Luckin ☕',
    amount: '1.00',
    description: '',
  },
  note: {
    label: 'Buy me a Starbucks ☕',
    amount: '5.00',
    description: '',
  },
  builder: {
    label: 'Buy me a durian pizza 🍕',
    amount: '10.00',
    description: '',
  },
} as const;

export type DonationTier = keyof typeof DONATION_TIERS;

export type DonationTierConfig = (typeof DONATION_TIERS)[DonationTier];

export const DONATION_TIER_KEYS = Object.keys(DONATION_TIERS) as DonationTier[];

export const DEFAULT_X402_NETWORK = 'eip155:84532' satisfies Network;

export function isDonationTier(value: string | null | undefined): value is DonationTier {
  return Boolean(value && value in DONATION_TIERS);
}

export function getDonationTier(value: string | null | undefined) {
  if (!isDonationTier(value)) {
    return null;
  }

  return DONATION_TIERS[value];
}
