/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "tailwindui.com",
      "ouvidoria.faculfadeunievangelica.edu.br",
      "localhost",
      "vestibular.faculdadeunievangelica.edu.br",
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
