import { DonateForm } from '@/components/donate/DonateForm';
import { DEFAULT_X402_NETWORK } from '@/lib/x402/shared';

export const metadata = {
  title: 'Donate | 0xsnickers.lol',
  description: 'Support 0xsnickers with USDC on Base.',
};

export default function DonatePage() {
  const network = process.env.NEXT_PUBLIC_X402_NETWORK || DEFAULT_X402_NETWORK;
  const networkLabel = network === 'eip155:8453' ? 'Base mainnet' : 'Base Sepolia';

  return (
    <main className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="min-w-0">
          <p className="mb-4 inline-flex rounded-full border border-primary/15 bg-white/75 px-3.5 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-md">
            Support the notes
          </p>
          <h1 className="text-4xl font-bold leading-tight text-text sm:text-5xl">
            支持我继续写笔记
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-text/70">
            如果这些内容对你有帮助，可以请我喝一杯，用 USDC on Base 支持一下。当前使用 {networkLabel}。
          </p>
          <div className="mt-7 rounded-2xl border border-white/55 bg-white/55 p-4 text-sm leading-6 text-text/65 shadow-sm backdrop-blur-md">
            <p className="font-semibold text-text">Small support, real fuel</p>
            <p className="mt-1">
              选一个轻量档位就好。每一笔支持都会变成新的笔记、实验和小项目。
            </p>
          </div>
        </div>

        <DonateForm />
      </section>
    </main>
  );
}
