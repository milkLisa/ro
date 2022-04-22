import Header from '../components/common/header'
import Footer from '../components/common/footer'
import ArrowForward from '@material-ui/icons/ArrowForward'

export default function Home({ locale, langContent }) {
  return (
    <>
      <Header title={langContent.main.title} />

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