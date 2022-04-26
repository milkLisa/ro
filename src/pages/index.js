import PageTitle from '../components/common/page_title'
import Footer from '../components/common/footer'
import ArrowForward from '@mui/icons-material/ArrowForward'

export default function Home({ locale, langContent }) {
  return (
    <>
      <PageTitle title={langContent.main.title} />

      <div className="container">
        
        <main className="list">
          <h1 className="title">
            {langContent.main.welcome}
          </h1>
          <span>
            <ArrowForward />
            <a href={`${locale}/timer`}>{langContent.mvp.title}</a>
          </span>
        </main>

        <Footer />
      </div>
    </>
  )
}