/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
