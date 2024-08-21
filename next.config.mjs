/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com'
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com'
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com'
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/api/auth/login',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/api/auth/register',
        permanent: true,
      },
    ]
  },
  webpack:(config,
    {buildId, dev, isServer, defaultLoaders, webpack}
  ) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  }
};

export default nextConfig;
