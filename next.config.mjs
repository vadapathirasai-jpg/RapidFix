/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Proxy backend API calls through our own origin so the browser
        // never makes a blocked cross-origin request from the preview.
        source: "/api/backend/:path*",
        destination: "https://i9ov6uhevk.execute-api.us-east-1.amazonaws.com/:path*",
      },
    ]
  },
}

export default nextConfig
