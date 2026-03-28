import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow product images from S3
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shaanoshaukat-uploads.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    // For static export (Option A), uncomment:
    // unoptimized: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Compress responses
  compress: true,

  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
