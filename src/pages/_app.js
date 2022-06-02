import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import * as gtag from '../lib/gtag'
import zhContent from '../constants/locales/zh_TW'
import enContent from '../constants/locales/en_US'
import '../assets/stylesheets/index.scss'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { locale } = router
  const intl = locale === "en-US" ? enContent : zhContent

  useEffect(() => {
    const handleRouteChange = url => gtag.pageview(url)
    
    router.events.on("routeChangeComplete", handleRouteChange)
    router.events.on("hashChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
      router.events.off("hashChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ gtag.GA_TRACKING_ID }`}
      />

      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            
            gtag("js", new Date());

            gtag("config", "${ gtag.GA_TRACKING_ID }", {
              page_path: window.location.pathname
            });
          `
        }}
      />

      <Component locale={ locale } intl={ intl } { ...pageProps } />
    </>
  )
}
