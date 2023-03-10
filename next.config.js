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

    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_APP_PRIVATE_KEY: process.env.GITHUB_APP_PRIVATE_KEY,
    GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
    GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,

    PROGRAM_ID: process.env.PROGRAM_ID,
    SIGNING_ORACLE_PRIVATE_KEY: process.env.SIGNING_ORACLE_PRIVATE_KEY,
  },
};

module.exports = nextConfig;
