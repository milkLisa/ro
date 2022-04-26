import PageTitle from '../../components/common/page_title'
import Layout from '../../components/timer/layout'
import MonsterCard from '../../components/timer/monster_card'
import { monsters } from '../../constants/monsters'

export default function Home({ langContent }) {
  const mons = monsters.filter((mon) => mon.isMVP);

  return (
    <>
      <PageTitle title={langContent.mvp.title} />

      <Layout title={langContent.mvp.title}>
        <div className="list">
          {mons.map((mon, index) => (
            <MonsterCard key={`${index}-${mon.id}`} monster={mon} />
          ))}
        </div>
      </Layout>
    </>
  )
}
