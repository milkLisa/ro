import { Component } from 'react'
import NativeSelect from '@mui/material/NativeSelect'
import AudioUploader from '../common/AudioUploader'
import DrawerContainer from '../common/DrawerContainer'
import DiscreteSlider from '../common/DiscreteSlider'
import ToggleSwitch from '../common/ToggleSwitch'
import { toMB, isValid, isChanged, template } from '../../utils/parser'
import { 
  MAX_AUDIO_FILES, MAX_AUDIO_SIZE, AUDIO_TYPES 
} from '../../constants/limit'

export default class SettingsDrawer extends Component {
  state = {
    settings: this.props.savedSettings,
    audios: this.props.savedAudios,
    players: this.buildPlayers([], this.props.savedAudios),
    message: null
  }
  isUpload = false
  
  componentDidUpdate(prevProps) {
    const { savedSettings, savedAudios } = this.props
    let { settings, audios, players } = this.state

    if (isChanged(prevProps.savedSettings, savedSettings) ||
      isChanged(prevProps.savedAudios, savedAudios)) {
      settings = savedSettings
      audios = savedAudios
      players = this.buildPlayers(players, savedAudios)
      this.setState({ settings, audios, players, message: null })
    }
  }

  buildPlayers(players, audios) {
    const playerObjs = players.reduce((obj, player) => {
      if (isValid(player.paused) && !player.paused) player.pause()
      obj[player.name] = player
      return obj
    }, {})

    let newPlayers = []
    if (audios) {
      newPlayers = audios.map(audio => {
        const name = audio.name
        if (name in playerObjs) {
          return playerObjs[name]
        } else {
          let player = new Audio(audio.src)
          player.addEventListener("pause", () => player.currentTime = 0)
          player.name = name
          return player
        }
      })
    }

    return newPlayers
  }

  playAudio(players, name) {
    return players.map(player => {
      if (player.name == name) {
        player.play()
      } else if (isValid(player.paused) && !player.paused) {
        player.pause()
      }
      return player
    })
  }

  handleChange(key, value) {
    if (!this.isUpload) {
      let { settings, players } = this.state
      this.playAudio(players, key === "remindAudio" ? value : "")
      Object.assign(settings, { [key]: value } )
      this.setState({ settings })
    }
  }

  handleClose() {
    const { settings, audios, players } = this.state
    this.playAudio(players, "")
    this.props.onClose(settings, audios)
  }

  handleAudioUpload(audio) {
    this.isUpload = true
    let { settings, audios, players } = this.state
    Object.assign(settings, { remindAudio: audio.name })
    audios.push(audio)
    players = this.buildPlayers(players, audios)
    this.playAudio(players, audio.name)
    this.setState({ settings, audios, players, message: null })
    this.isUpload = false
  }

  handleAudioDelete(name) {
    let { settings, audios, players } = this.state
    Object.assign(settings, { remindAudio: audios[0].name })
    audios = audios.filter(audio => audio.name !== name)
    players = this.buildPlayers(players, audios)
    this.setState({ settings, audios, players, message: null })
  }

  handleUploadError(error) {
    const { intl } = this.props
    const { type, name, size, err } = error
    this.playAudio(this.state.players, "")

    let message = ""
    switch (type) {
      case "type":
        message = template(intl.timer.typeError, name, AUDIO_TYPES.join(","))
        break
      case "size":
        message = template(intl.timer.sizeError, name, toMB(size))
        break
      case "format":
        message = template(intl.timer.formatError, name, err)
        break
      default:
        message = template(`intl.timer.${type}Error`, name)
    }

    this.setState({ message })
  }

  render() {
    const { intl, isOpen } = this.props
    const { settings, audios, message } = this.state
    const { showName, showLocation, showDateTime, remindBefore, 
      continueAfter, remindAudio, playSeconds } = settings
    const uploadList = audios.filter(a => !a.isDefault)
    
    return (
      <DrawerContainer
        intl    = { intl }
        keep    = { true }
        anchor  = "right"
        isOpen  = { isOpen }
        header  = { <span>{ intl.timer.settingTitle }</span> }
        onClose = { () => this.handleClose() }
      >
        <div className="settings-table">
          <div>
            <span>{ intl.timer.showName }</span>
            <ToggleSwitch 
              status  = { showName }
              onSwitch= { status => this.handleChange("showName", status) }
            />
          </div>

          <div>
            <span>{ intl.timer.showLocation }</span>
            <ToggleSwitch 
              status  = { showLocation }
              onSwitch= { status => this.handleChange("showLocation", status) }
            />
          </div>

          <div>
            <span>{ intl.timer.showDateTime }</span>
            <ToggleSwitch 
              status  = { showDateTime }
              onSwitch= { status => this.handleChange("showDateTime", status) }
            />
          </div>

          <div>
            <span>{ intl.timer.remindBefore }</span>
            <DiscreteSlider 
              max     = { 10 } 
              value   = { remindBefore } 
              onChange= { value => this.handleChange("remindBefore", value) }
            />
          </div>

          <div>
            <span>{ intl.timer.continueAfter }</span>
            <DiscreteSlider 
              max     = { 5 } 
              value   = { continueAfter } 
              onChange= { value => this.handleChange("continueAfter", value) }
            />
          </div>

          <div>
            <span>{ intl.timer.remindAudio }</span>
            <div className="native-select">
              <NativeSelect 
                value    = { remindAudio || "nan" }
                onChange = { e => this.handleChange("remindAudio", e.target.value) }
              >
                <option key="-1" value="nan">{ intl.timer.noneAudio }</option>
                {
                  audios.map((audio, index) => 
                    <option key={ index } value={ audio.name }>
                      { audio.name }
                    </option>
                  )
                }
              </NativeSelect>
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
                onChange= { value => this.handleChange("playSeconds", value) }
              />
            </div>
          }

          {
            isValid(remindAudio) &&
            <AudioUploader
              name        = "remind_audio"
              uploadList  = { uploadList }
              maxLimit    = { MAX_AUDIO_FILES }
              maxMsg      = { intl.timer.uploadMax }
              sizeLimit   = { MAX_AUDIO_SIZE }
              errorMsg    = { message }
              fileTypes   = { AUDIO_TYPES }
              placeholder = { intl.timer.uploadAudio }
              onUpload    = { obj => this.handleAudioUpload(obj) }
              onDelete    = { name => this.handleAudioDelete(name) }
              onError     = { error => this.handleUploadError(error) }
            />
          }
        </div>
          
      </DrawerContainer>
    )
  }
}