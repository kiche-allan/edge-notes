import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Markdown content is read from disk at runtime; ship it with the server bundle.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  poweredByHeader: false,
};

export default nextConfig;
