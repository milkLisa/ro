import { Component } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { isValid, isChanged } from '../../utils/parser'

export default class AudioPlayer extends Component {
  state = { isError: false, errorMsg: null }
  playId = null
  player = null
  startTime = 0
  
  componentDidMount() {
    this.player = this.buildPlayer(this.props.src)
  }

  componentDidUpdate(prevProps) {
    const { remindId, src, delay } = this.props

    if (isChanged(prevProps.remindId, remindId)) {
      if (isValid(remindId)) {
        if (this.startTime > 0) this.player.currentTime = 0

        this.startTime = Date.now()
        this.renewInterval(delay)
        this.playAudio()
      } else {
        this.finish(false)
      }
    }
    
    if (isChanged(prevProps.src, src)) {
      this.clearPlayer()
      this.player = this.buildPlayer(src)
      
      if (this.startTime > 0) this.playAudio()
    }
    
    if (this.startTime > 0 && isChanged(prevProps.delay, delay)) {
      const leftMilliseconds = delay - Date.now() + this.startTime
      
      if (leftMilliseconds > 0) {
        this.renewInterval(leftMilliseconds)
      } else {
        this.finish(true)
      }
    }
  }

  componentWillUnmount() {
    this.clearPlayer()
    clearInterval(this.playId)
  }

  changeState(isError, errorMsg) {
    if (this.state.isError != isError) this.setState({ isError, errorMsg })
  }

  buildPlayer(src) {
    let audio = new Audio(src)
    audio.load()
    audio.loop = true
    audio.playsInline = true
    audio.addEventListener("pause", () => {
      audio.currentTime = 0
      this.changeState(false, null)
    })
    return audio
  }

  playAudio() {
    this.player.play()
    .then(() => this.changeState(false, null))
    .catch(() => this.changeState(true, this.props.intl.timer.playError))
  }
  
  clearPlayer() {
    if (this.player) {
      this.player.pause()
      this.player = null
    }
  }

  renewInterval(milliseconds) {
    clearInterval(this.playId)
    this.playId = setInterval(() => this.finish(true), milliseconds)
  }

  finish(isAuto) {
    this.player && this.player.pause()
    clearInterval(this.playId)
    this.playId = null
    this.startTime = 0

    if (isAuto) this.props.onFinish(this.props.remindId)
  }

  handleOk() {
    const { remindId, delay } = this.props
    if (isValid(remindId)) {
      this.renewInterval(delay)
      this.player.play()
    }
    this.changeState(false, null)
  }

  render() {
    const { intl } = this.props
    const { isError, errorMsg } = this.state

    return (
      <>
        {
          isError &&
          <Dialog 
            className = "alert-dialog"
            open      = { true }
            onClose   = { () => this.handleOk() }
          >
            <DialogTitle>
              { intl.timer.playAlertTitle }
            </DialogTitle>
            
            <DialogContent className="desc">
              { errorMsg }
            </DialogContent>

            <DialogActions className="center">
              <Button
                variant = "contained"
                onClick = { () => this.handleOk() }
              >
                { intl.timer.allow }
              </Button>
            </DialogActions>
          </Dialog>
        }
      </>
    )
  }
}