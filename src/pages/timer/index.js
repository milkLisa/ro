import { Component } from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import timerTheme from '../../assets/themes/timerTheme'
import HtmlHead from '../../components/common/HtmlHead'
import Header from '../../components/common/Header'
import Layout from '../../components/timer/Layout'

export default class Home extends Component {
  componentDidMount() {
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
  }

  render() {
    const { intl } = this.props
    
    return (
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        
        <ThemeProvider theme={ timerTheme }>
          <HtmlHead title={ intl.timer.title } />

          <Container className="timer-container">
            <Header title={ intl.timer.title } />

            <Layout intl={ intl } />
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    )
  }
}
