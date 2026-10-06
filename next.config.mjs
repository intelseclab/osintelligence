import { fileURLToPath } from "node:url"

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      include: fileURLToPath(new URL("./public/tools/", import.meta.url)),
      type: "asset/source",
    })
    return config
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
