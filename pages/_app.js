import '../assets/stylesheets/index.scss'
import { useRouter } from "next/router"
import zhContent from '../public/static/locales/zh_TW'
import enContent from '../public/static/locales/en_US'

export default function MyApp({ Component, pageProps }) {
  const { locale } = useRouter();
  const langContent = locale === "en-US" ? enContent : zhContent;

  return <Component locale={locale} langContent={langContent} {...pageProps} />
}
