/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  env: {
    GOOGLE_CLIENT_ID:
      "624622164114-ejdv1uvca13mi9cpid2fj8qf6pulbo1b.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    NEXTAUTH_SECRET: "5c3d24485bb838879e06f5bebca5652f",
  },
  experimental: {
    appDir: true,
    serverActions: true,
    serverActionsBodySizeLimit: "2mb",
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.static-src.com",
        port: "",
        pathname: "/siva/asset/**",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
