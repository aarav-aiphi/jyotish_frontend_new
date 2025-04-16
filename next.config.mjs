/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 'srcs.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'pujayagna.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'www.indastro.com' },
      { protocol: 'https', hostname: 'i.ibb.co' }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', 
        destination: 'http://localhost:7000/api/v1/:path*', 
      },
    ];
  },  
};

export default nextConfig;
