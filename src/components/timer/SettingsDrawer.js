import { useEffect, useReducer } from 'react'
import NativeSelect from '@mui/material/NativeSelect'
import { isValid } from '../../utils/parser'
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

  const { showName, showLocation, showDateTime, remindBefore, 
    continueAfter, remindAudio, playSeconds, audios } = settings
  
  return (
    <DrawerContainer
      intl    = { intl }
      anchor  = "right"
      isOpen  = { isOpen }
      header  = { <span>{ intl.timer.settingTitle }</span> }
      onClose ={ () => onClose(settings) }
    >
      {
        savedSettings
        ? 
        <div className="settings-table">
          <div>
            <span>{ intl.timer.showName }</span>
            <ToggleSwitch 
              status  = { showName }
              onSwitch= { status => handleChange("showName", status) }
            />
          </div>

          <div>
            <span>{ intl.timer.showLocation }</span>
            <ToggleSwitch 
              status  = { showLocation }
              onSwitch= { status => handleChange("showLocation", status) }
            />
          </div>

          <div>
            <span>{ intl.timer.showDateTime }</span>
            <ToggleSwitch 
              status  = { showDateTime }
              onSwitch= { status => handleChange("showDateTime", status) }
            />
          </div>

          <div>
            <span>{ intl.timer.remindBefore }</span>
            <DiscreteSlider 
              max     = { 10 } 
              value   = { remindBefore } 
              onChange= { value => handleChange("remindBefore", value) }
            />
          </div>

          <div>
            <span>{ intl.timer.continueAfter }</span>
            <DiscreteSlider 
              max     = { 5 } 
              value   = { continueAfter } 
              onChange= { value => handleChange("continueAfter", value) }
            />
          </div>

          <div>
            <span>{ intl.timer.remindAudio }</span>
            <div className="native-select">
              <NativeSelect 
                value    = { remindAudio || "nan" }
                onChange = { e => handleChange("remindAudio", e.target.value) }
              >
                <option key="-1" value="nan">{ intl.timer.noneAudio }</option>
                {
                  audios && audios.map((src, index) => 
                    <option key={ index } value={ src }>
                      { src.slice(src.lastIndexOf("/") + 1) }
                    </option>
                  )
                }
              </NativeSelect>
              
              {
                isValid(remindAudio) &&
                <audio autoPlay src={ remindAudio } />
              }
            </div>
          </div>

            {
              isValid(remindAudio) &&
              <div>
                <span>{ intl.timer.playSeconds }</span>
                <DiscreteSlider 
                  step    = { 5 }
                  min     = { 5 }
                  max     = { 60 } 
                  value   = { playSeconds } 
                  onChange= { value => handleChange("playSeconds", value) }
                />
              </div>
            }
        </div>
        :
        <span>{ intl.timer.emptyError }</span>
      }
    </DrawerContainer>
  )
}