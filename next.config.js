const withPWA = require("next-pwa")

module.exports = withPWA({
  async redirects() {
    return [
      {
        source: "/",
        destination: "/timer",
        permanent: true,
      }
    ]
  },
  compress: true,
  reactStrictMode: true,
  i18n: {
    locales: ["default", "zh-TW", "en-US"],
    defaultLocale: "default",
    localeDetection: false
  },
  pwa: {
    dest: "public",
    importScripts: ["/pwa/serviceWorker.js"]
  }
})