import { useEffect, useReducer } from 'react'
import DrawerContainer from '../common/DrawerContainer'
import DiscreteSlider from '../common/DiscreteSlider'
import ToggleSwitch from '../common/ToggleSwitch'

export default function SettingsDrawer({ 
  intl, isOpen, savedSettings, onClose 
}) {
  const [settings, setSettings] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState })
    , savedSettings)
  
  useEffect(() => setSettings(savedSettings), [savedSettings])

  const handleChange = (key, value) => {
    setSettings({ [key]: value })
  }

  return (
    <DrawerContainer
      anchor  = "right"
      isOpen  = { isOpen }
      onClose ={ () => onClose(settings) }
    >
      {
        settings
        ? <div className="settings-table">
          <div>
            <span>{ intl.timer.showName }</span>
            <ToggleSwitch 
              status  = { settings.showName }
              onSwitch= { status => handleChange("showName", status) }
            />
          </div>
          <div>
            <span>{ intl.timer.showLocation }</span>
            <ToggleSwitch 
              status  = { settings.showLocation }
              onSwitch= { status => handleChange("showLocation", status) }
            />
          </div>
          <div>
            <span>{ intl.timer.showDateTime }</span>
            <ToggleSwitch 
              status  = { settings.showDateTime }
              onSwitch= { status => handleChange("showDateTime", status) }
            />
          </div>
          <div>
            <span>{ intl.timer.remindBefore }</span>
            <DiscreteSlider 
              max     = { 10 } 
              value   = { settings.remindBefore } 
              onChange= { value => handleChange("remindBefore", value) }
            />
          </div>
          <div>
            <span>{ intl.timer.continueAfter }</span>
            <DiscreteSlider 
              max     = { 5 } 
              value   = { settings.continueAfter } 
              onChange= { value => handleChange("continueAfter", value) }
            />
          </div>
        </div>
        : <span>{ intl.timer.emptyError }</span>
      }
    </DrawerContainer>
  )
}