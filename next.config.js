/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  env: {
    GITHUB_OAUTH_ID: process.env.GITHUB_OAUTH_ID,
    GITHUB_OAUTH_SECRET: process.env.GITHUB_OAUTH_SECRET,
  },
};

module.exports = nextConfig;
