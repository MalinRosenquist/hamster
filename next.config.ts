import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.rebrickable.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "img.tradera.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
