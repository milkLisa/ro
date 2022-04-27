import PageTitle from '../../components/common/page_title'
import Layout from '../../components/timer/layout'
import MonsterList from '../../components/timer/monster_list'

export default function Home({ langContent }) {
  return (
    <>
      <PageTitle title={ langContent.mvp.title } />
      <Layout title={ langContent.mvp.title }>
        <MonsterList langContent={ langContent } />
      </Layout>
    </>
  )
}
