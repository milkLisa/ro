import { useEffect } from 'react'
import { useRouter } from "next/router"
import zhContent from '../constants/locales/zh_TW'
import enContent from '../constants/locales/en_US'
import '../assets/stylesheets/index.scss'

export default function MyApp({ Component, pageProps }) {
  const { locale } = useRouter()
  const langContent = locale === "en-US" ? enContent : zhContent
  
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope)
          },
          function (err) {
            console.log("Service Worker registration failed: ", err)
          }
        )
      })
    } else {
      console.log("Service worker not supported")
    }
  }, [])
  
  return <Component locale={locale} langContent={langContent} {...pageProps} />
}
