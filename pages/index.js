import Header from '/components/header'
import Footer from '/components/footer'
import ArrowForward from '@material-ui/icons/ArrowForward'

export default function Home({ locale, langContent }) {
  return (
    <div className="container">
      <Header title={langContent.main.title} />

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
  )
}