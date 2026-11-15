import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 só aceita qualidades listadas aqui
  images: { qualities: [75, 90] },
};

export default nextConfig;
