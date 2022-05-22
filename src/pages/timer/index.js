import { useState, useEffect } from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import SettingsIcon from '@mui/icons-material/Settings'
import timerTheme from '../../assets/themes/timerTheme'
import { SettingsObj } from '../../constants/customData'
import HtmlHead from '../../components/common/HtmlHead'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import GitHubLink from '../../components/common/GitHubLink'
import ScrollTopButton from '../../components/common/ScrollTopButton'
import Content from '../../components/timer/Content'
import SettingsDrawer from '../../components/timer/SettingsDrawer'
import { query, update } from '../../utils/fetchData'
import { isChanged } from '../../utils/parser'

export default function Home({ intl }) {
  const [isOpen, setIsOpen]     = useState(false)
  const [settings, setSettings]  = useState(SettingsObj())
  
  useEffect(() => {
    query("/api/settings").then(data => { 
      setSettings(data && data[0])
    })

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

  const changeSettings = newSettings => {
    setIsOpen(false)

    if (isChanged(settings, newSettings)) {
      setSettings(newSettings)
      update("/api/settings", newSettings)
    }
  }

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      
      <ThemeProvider theme={ timerTheme }>
        <HtmlHead title={ intl.timer.title } />

        <Container className="timer-container">
          <Header title={ intl.timer.title }>
            <div>
              <SettingsIcon onClick={ () => setIsOpen(true) }/>

              <GitHubLink />
            </div>
          </Header>
          
          <Content intl={ intl } settings={ settings } />

          <Footer copyright={ intl.copyright }/>
          
          <SettingsDrawer
            intl          = { intl }
            isOpen        = { isOpen }
            savedSettings = { settings }
            onClose       = { newSettings => changeSettings(newSettings) }
          />

          <ScrollTopButton />
        </Container>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
