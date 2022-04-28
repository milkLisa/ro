import PageTitle from '../components/common/PageTitle'
import Footer from '../components/common/Footer'
import ArrowForward from '@mui/icons-material/ArrowForward'

export default function Home({ locale, langContent }) {
  return (
    <>
      <PageTitle title={ langContent.main.title } />

      <div className="container">
        <main>
          <h1 className="title">
            { langContent.main.welcome }
          </h1>

          <span>
            <ArrowForward />
            <a href={ `${ locale }/timer` }>{ langContent.mvp.title }</a>
          </span>
        </main>

        <Footer />
      </div>
    </>
  )
}