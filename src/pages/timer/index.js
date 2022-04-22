import Header from '../../components/common/header'
import Layout from '../../components/timer/layout'

export default function Home({ langContent }) {
  return (
    <>
      <Header title={langContent.mvp.title} />

      <Layout>
        <h1 className="title">
          {langContent.mvp.welcome}
        </h1>
      </Layout>
    </>
  )
}
