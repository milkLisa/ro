import HtmlHead from '../components/common/HtmlHead'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import ArrowForward from '@mui/icons-material/ArrowForward'

export default function Home({ locale, intl }) {
  return (
    <>
      <HtmlHead title={ intl.home.title } />

      <div className="container">
        <Header title={ intl.home.welcome } />

        <main>
          <span className="list">
            <ArrowForward />
            <a href={ `${ locale }/timer` }>{ intl.timer.title }</a>
          </span>
        </main>

        <Footer copyright={ intl.copyright } />
      </div>
    </>
  )
}