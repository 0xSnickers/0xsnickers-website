import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
