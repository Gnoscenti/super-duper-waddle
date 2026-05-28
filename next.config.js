/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for Capacitor mobile builds
  // Set MOBILE_BUILD=true when building for Android/iOS
  ...(process.env.MOBILE_BUILD === 'true' && { output: 'export' }),
};

module.exports = nextConfig;
