const withPWA = require("next-pwa");

module.exports = withPWA({
  async redirects() {
    return [
      {
        source: "/",
        destination: "/timer",
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  i18n: {
    locales: ["default", "zh-TW", "en-US"],
    defaultLocale: "default",
    localeDetection: false,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
})