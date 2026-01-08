/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Dòng này cực kỳ quan trọng
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Hoặc nếu bạn muốn cụ thể hơn với cloud name của bạn:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //     pathname: '/your_cloud_name/**',
    //   },
    // ],
  },
};

module.exports = nextConfig;