/** @type {import('next').NextConfig} */
const path = require("path");

module.exports = {
  reactStrictMode: true,
  // Allows isolated validation builds without touching a running/local .next directory.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};
