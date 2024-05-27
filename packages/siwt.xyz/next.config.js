//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next/plugins/with-nx')

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // output: 'export',
  // distDir: '../../dist/packages/siwt.xyz',
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
        },
      }
    }
    return config
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
    dirs: ['common', 'mocks', 'server'],
  },
  // async headers() {
  //   return [
  //       {
  //           // matching all API routes
  //           source: "/api/siwt/:path*",
  //           headers: [
  //               { key: "Access-Control-Allow-Credentials", value: "true" },
  //               { key: "Access-Control-Allow-Origin", value: 'http://localhost:4200' }, // replace this your actual origin
  //               { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
  //               { key: "Access-Control-Allow-Headers", value: "Content-Type" },
  //           ]
  //       }
  //   ]
  // },
}

module.exports = withNx(nextConfig)
