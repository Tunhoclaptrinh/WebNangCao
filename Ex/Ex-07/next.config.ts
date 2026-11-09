import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  outputFileTracingRoot: process.cwd(),
  transpilePackages: ["@ant-design/colors", "@ant-design/fast-color"],
  experimental: {
    cpus: 2,
    optimizePackageImports: ["antd", "@ant-design/icons"],
  },
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
