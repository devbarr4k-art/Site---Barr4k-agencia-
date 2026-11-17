import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 só aceita qualidades listadas aqui
  images: {
    qualities: [75, 90],
    // fotos enviadas pelo /admin ficam no Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
