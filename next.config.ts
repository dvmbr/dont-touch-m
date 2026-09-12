import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/001",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
