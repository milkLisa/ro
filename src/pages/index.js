import HtmlHead from '../components/common/HtmlHead'
import Footer from '../components/common/Footer'
import ArrowForward from '@mui/icons-material/ArrowForward'

export default function Home({ locale, intl }) {
  return (
    <>
      <HtmlHead title={ intl.main.title } />

      <div className="container">
        <main>
          <h1 className="title">
            { intl.main.welcome }
          </h1>

          <span>
            <ArrowForward />
            <a href={ `${ locale }/timer` }>{ intl.mvp.title }</a>
          </span>
        </main>

        <Footer />
      </div>
    </>
  )
}