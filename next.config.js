/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/api/auth/signin',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/poll',
        destination: '/poll/new',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['tailwindui.com'],
  },
};

module.exports = nextConfig;
