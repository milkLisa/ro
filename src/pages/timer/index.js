import { Component } from 'react'
import { StyledEngineProvider } from '@mui/material/styles'
import HtmlHead from '../../components/common/HtmlHead'
import Layout from '../../components/timer/Layout'
import TimerList from '../../components/timer/TimerList'

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
        <HtmlHead title={ intl.timer.title } />
        
        <Layout title={ intl.timer.title }>
          <TimerList intl={ intl } />
        </Layout>
      </StyledEngineProvider>
    )
  }
}
