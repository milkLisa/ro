import { useEffect, useReducer } from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import timerTheme from '../../assets/themes/timerTheme'
import HtmlHead from '../../components/common/HtmlHead'
import Header from '../../components/common/Header'
import Layout from '../../components/timer/Layout'
import Footer from '../../components/common/Footer'
import LoadingModal from '../../components/common/LoadingModal'
import ScrollTopButton from '../../components/common/ScrollTopButton'
import * as fetchData from '../../utils/fetchData'
import { objReducer } from '../../utils/parser'

export default function Timer({ intl }) {
  const [data, setData] = useReducer(objReducer, null)
  
  useEffect(() => {
    fetchData.query(["/api/settings", "/api/audios", "/api/monsters", "/api/timers"])
      .then(result => {
        result.settings = result.settings && result.settings[0]
        if (result && Object.keys(result).every(key => !!result[key])) {
          setData({ ...result })
        } else {
          setData({ isError: true })
        }
      })
  }, [])

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      
      <ThemeProvider theme={ timerTheme }>
        <HtmlHead title={ intl.timer.title } />

        <Container className="timer-container">
          { 
            !data || data.isError
            ? <>
                <Header title={ intl.timer.title } />
                <main>
                {
                  !data
                  ? <LoadingModal message={ intl.home.loading } />
                  : intl.timer.emptyError
                }
                </main>
              </>
            : <Layout intl={ intl } data={ data } />
          }

          <ScrollTopButton />
      
          <Footer copyright={ intl.copyright } />
        </Container>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}