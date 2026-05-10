'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col pt-20">
      <div className="flex-grow">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
