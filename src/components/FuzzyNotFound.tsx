'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import FuzzyText from '@/components/FuzzyText.jsx';

export function FuzzyNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-16 text-text">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="flex w-full max-w-[680px] flex-col items-center justify-center overflow-visible">
          <FuzzyText
            baseIntensity={0.22}
            hoverIntensity={0.5}
            enableHover
            fuzzRange={30}
            fps={24}
            direction="horizontal"
            fontFamily="'Baloo 2', cursive"
            fontWeight={900}
            fontSize="clamp(8rem, 28vw, 18rem)"
            color="#0c4a6e"
            className="mx-auto block h-auto w-full max-w-[680px]"
          >
            404
          </FuzzyText>

        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Home className="h-4 w-4" />
            回到首页
          </Link>
        </div>
      </section>
    </main>
  );
}
