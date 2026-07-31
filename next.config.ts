import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-tools badge on localhost (production never shows it)
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      // Canonical domain: send www.mindmirageindia.com → mindmirageindia.com
      // so OAuth callback URIs always match the authorized redirect URI.
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.mindmirageindia.com",
          },
        ],
        destination: "https://mindmirageindia.com/:path*",
        permanent: true,
      },
      // Counselling merged into Consultation.
      {
        source: "/counselling/:path*",
        destination: "/consultation",
        permanent: true,
      },
      // Yoga Sūtras merged into the Sānkhya Darśan + Yoga Sūtras course.
      {
        source: "/programs/yoga-sutras",
        destination: "/programs/sankhya-darshan",
        permanent: true,
      },
      // 1-on-1 Guided Meditation retired — replaced by the 3-level Meditation course.
      {
        source: "/programs/1on1-guided-meditation",
        destination: "/programs/meditation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
