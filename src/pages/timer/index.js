import { StyledEngineProvider } from '@mui/material/styles'
import HtmlHead from '../../components/common/HtmlHead'
import Layout from '../../components/timer/Layout'
import TimerList from '../../components/timer/TimerList'

export default function Home({ intl }) {
  return (
    <StyledEngineProvider injectFirst>
      <HtmlHead title={ intl.timer.title } />
      
      <Layout title={ intl.timer.title }>
        <TimerList intl={ intl } />
      </Layout>
    </StyledEngineProvider>
  )
}
