import { useRouter } from 'next/router'
import zhContent from '../constants/locales/zh_TW'
import enContent from '../constants/locales/en_US'
import '../assets/stylesheets/index.scss'

export default function MyApp({ Component, pageProps }) {
  const { locale } = useRouter()
  const intl = locale === "en-US" ? enContent : zhContent

  return <Component locale={ locale } intl={ intl } { ...pageProps } />
}
