import Header from '/components/header'
import Footer from '/components/footer'

export default function Home({ langContent }) {
  return (
    <div className="container">
      <Header title={langContent.mvp.title} />

      <main>
        <h1 className="title">
          {langContent.mvp.welcome}
        </h1>
      </main>

      <Footer />
    </div>
  )
}
