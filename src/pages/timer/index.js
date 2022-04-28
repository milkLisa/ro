import PageTitle from '../../components/common/PageTitle'
import Layout from '../../components/timer/Layout'
import TimerList from '../../components/timer/TimerList'

export default function Home({ langContent }) {
  return (
    <>
      <PageTitle title={ langContent.mvp.title } />
      
      <Layout title={ langContent.mvp.title }>
        <TimerList langContent={ langContent } />
      </Layout>
    </>
  )
}
