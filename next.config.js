/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  output: "export",
  reactStrictMode: true,
  // Use the prefix for GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // assetPrefix: "/nextjs-nrc/",
  // Enable static export
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: "out",
  trailingSlash: true,
};

module.exports = nextConfig;
