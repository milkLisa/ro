import { useReducer } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import * as gtag from '../../lib/gtag'
import Header from '../../components/common/Header'
import Content from '../../components/timer/Content'
import SettingsDrawer from '../../components/timer/SettingsDrawer'
import * as fetchData from '../../utils/fetchData'
import { isChanged, objReducer } from '../../utils/parser'

export default function Layout({ intl, data }) {
  const [state, setState] = useReducer(objReducer, { 
    isOpen: false, settings: data.settings, audios: data.audios 
  })

  const changeSettings = (newSettings, newAudios) => {
    let needUpdate = false
    if (isChanged(audios, newAudios)) {
      needUpdate = true
      fetchData.renew("/api/audios", newAudios)
    }

    if (isChanged(settings, newSettings)) {
      needUpdate = true
      fetchData.update("/api/settings", newSettings)
      gtag.event("Change Settings", "Settings", JSON.stringify(newSettings))
    }

    setState(
      needUpdate 
      ? { isOpen: false, settings: newSettings, audios: newAudios } 
      : { isOpen: false }
    )
  }

  const { isOpen, settings, audios } = state
  return (
    <>
      <Header title={ intl.timer.title }>
        <SettingsIcon onClick={ () => setState({ isOpen: true }) } />
      </Header>
      
      <Content 
        intl          = { intl }
        monsters      = { data.monsters }
        defaultTimers = { data.timers }
        settings      = { settings }
        audios        = { audios }
      />

      <SettingsDrawer
        intl          = { intl }
        isOpen        = { isOpen }
        savedSettings = { settings }
        savedAudios   = { audios }
        onClose       = { changeSettings }
      />
    </>
  )
}