import { StyledEngineProvider } from '@mui/material/styles'
import HtmlHead from '../../components/common/HtmlHead'
import Layout from '../../components/timer/Layout'
import TimerList from '../../components/timer/TimerList'

export default function Home({ langContent }) {
  return (
    <StyledEngineProvider injectFirst>
      <HtmlHead title={ langContent.mvp.title } />
      
      <Layout title={ langContent.mvp.title }>
        <TimerList langContent={ langContent } />
      </Layout>
    </StyledEngineProvider>
  )
}
