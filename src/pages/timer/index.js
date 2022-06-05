import { useState, useEffect, useReducer } from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import SettingsIcon from '@mui/icons-material/Settings'
import timerTheme from '../../assets/themes/timerTheme'
import { SettingsObj } from '../../constants/dataFormat'
import HtmlHead from '../../components/common/HtmlHead'
import Header from '../../components/common/Header'
import LoadingModal from '../../components/common/LoadingModal'
import ScrollTopButton from '../../components/common/ScrollTopButton'
import Content from '../../components/timer/Content'
import SettingsDrawer from '../../components/timer/SettingsDrawer'
import * as gtag from '../../lib/gtag'
import { query, renew, update } from '../../utils/fetchData'

export default function Home({ intl }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState]    = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState })
    , { settings: SettingsObj(), audios: [] })

  const { settings, audios } = state

  useEffect(() => {
    query(["/api/settings", "/api/audios"])
      .then(data => setState({ settings: data.settings[0], audios: data.audios }))

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        registration => {
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope
          )
        },
        err => {
          console.log("Service Worker registration failed: ", err)
        }
      )
    } else {
      console.log("Service worker not supported")
    }
  }, [])

  const changeSettings = (newSettings, newAudios) => {
    setIsOpen(false)
    renew("/api/audios", newAudios)
    update("/api/settings", newSettings)
    gtag.event("Change Settings", "Settings", JSON.stringify(newSettings))
    setState({ settings: newSettings, audios: newAudios })
  }

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      
      <ThemeProvider theme={ timerTheme }>
        <HtmlHead title={ intl.timer.title } />

        { 
          audios && !audios.length
          ? <LoadingModal intl={ intl } open={ true } />
          : <Container className="timer-container">
              <Header title={ intl.timer.title }>
                <SettingsIcon onClick={ () => setIsOpen(true) }/>
              </Header>
              
              <Content intl={ intl } settings={ settings } audios={ audios } />
              
              <SettingsDrawer
                intl          = { intl }
                isOpen        = { isOpen }
                savedSettings = { settings }
                savedAudios   = { audios }
                onClose       = { changeSettings }
              />

              <ScrollTopButton />
            </Container>
        }
      </ThemeProvider>
    </StyledEngineProvider>
  )
}