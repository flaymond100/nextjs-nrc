/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  output: "export",
  // Use the prefix for GitHub Pages
  basePath: "/nextjs-nrc/",
  assetPrefix: "/nextjs-nrc/",
  // Enable static export
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: "out",
};

module.exports = nextConfig;
