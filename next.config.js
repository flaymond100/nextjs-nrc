/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  // Removed "output: export" to enable dynamic routes for new races
  // If you need static export, you'll need to set up automatic rebuilds
  // when races are created (via webhook + CI/CD)
  reactStrictMode: true,
  // Use the prefix for GitHub Pages
  // assetPrefix: "/nextjs-nrc/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: "out",
};

module.exports = nextConfig;
