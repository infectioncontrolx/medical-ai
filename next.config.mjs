/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Added iOS-specific optimizations
  swcMinify: false, // Disable SWC minification to reduce potential iOS issues
  productionBrowserSourceMaps: true, // Enable source maps for better debugging
  webpack: (config, { isServer }) => {
    // Disable compression in development and optimize for iOS
    if (!isServer) {
      config.optimization.minimize = false;

      // Ensure compatibility with older iOS versions
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    // Disable experimental features that might cause iOS issues
    optimizeCss: false,
    scrollRestoration: false,
  },
  // Add headers for better iOS compatibility
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
