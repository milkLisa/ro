import { Component } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { TimerObj } from '../../constants/customData'
import { 
  MINUTE, SECOND, getFormatedTime, parseToMSEC 
} from '../../constants/dateTime'

const getClass = (stable, isStart, time) => {
  let classArr = [stable]

  if(isStart) {
    classArr.push("timer")

    if(time < 0)
      classArr.push("appeared")
    else if(time < MINUTE)
      classArr.push("alert")
  }

  return classArr.join(" ")
}

export default class MonsterCard extends Component {
  state = {
    isStart: false,
    isEdit: false,
    editText: "",
    defaultTime: this.props.monster.editMSEC || this.props.monster.msec,
    time: this.props.monster.msec
  }

  componentDidMount() {
    const { monster } = this.props
    if (monster.utcMSEC) {
      const msec = (monster.utcMSEC || 0) - Date.now()
      if(msec <= -MINUTE){
        this.handleSwitch(false)
      } else {
        this.setState({ time: msec })
        this.start()
      }
    } else if (monster.editMSEC) {
      this.setState({ time: monster.editMSEC })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  timing() {
    const { monster } = this.props
    const msec = (monster.utcMSEC || 0) - Date.now()
    msec <= -MINUTE 
      ? this.handleSwitch(false) 
      : this.setState({ time: msec })
  }

  start() {
    const { defaultTime } = this.state
    const { monster, onChange } = this.props

    clearInterval(this.timer)
    this.timer = setInterval(() => this.timing(), SECOND)

    onChange(TimerObj(monster,
      { utcMSEC: defaultTime + Date.now(), intervalId: this.timer }
    ))

    this.setState({ isStart: true })
  }

  stop() {
    const { monster, onChange } = this.props

    clearInterval(this.timer)
    onChange(TimerObj(monster,{ utcMSEC: null, intervalId: null }))

    this.setState({ isStart: false, time: this.state.defaultTime })
  }

  handleSwitch(turnOn) {
    turnOn ? this.start() : this.stop()
  }

  handleEditTime(e) {
    e.preventDefault()
    this.setState({ isEdit: true })
    return false
  }

  handleEditChange(e) {
    this.setState({ editText: e.target.value })
  }

  handleEditClose() {
    this.setState({ isEdit: false, editText: "" })
  }

  handleEditOk() {
    const { editText } = this.state
    const { monster, onChange } = this.props
    let msec = parseToMSEC(editText)
    msec = msec < SECOND ? monster.editMSEC || monster.msec : msec

    onChange(TimerObj(monster, 
      { utcMSEC: msec + Date.now(), editMSEC: msec }
    ))

    this.setState({ 
      isEdit: false, 
      editText: "", 
      defaultTime: msec,
      time: msec
    })

    this.start()
  }

  render() {
    const { monster, intl } = this.props
    const { isStart, isEdit, editText, time } = this.state
    const img = "/static/images/" + (monster.image ? monster.image : "egg.png")
    
    return (
      <div className={ getClass("monster-card", isStart, time) }>
        <div 
          className = "avatar"
          onClick   = { () => this.handleSwitch(!isStart) }
          onContextMenu = { e => this.handleEditTime(e) }
        >
          <div className="time">
            { getFormatedTime(time) }
          </div>

          <style jsx>{`
            .avatar {
              background-image: url(${img});
            }
          `}</style>
        </div>

        <div className="info">
          <div>{ monster.name }</div>
          
          <div className="location">{ monster.location }</div>
        </div>

        <Dialog 
          className = "edit-dialog"
          open      = { isEdit } 
          onClose   = { () => this.handleEditClose() }
        >
          <DialogTitle>{ intl.timer.editTitle }</DialogTitle>

          <div className="desc">
            { intl.timer.editDesc }
          </div>

          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              hiddenLabel
              margin    = "none"
              type      = "tel"
              value     = { editText }
              onChange  = { e => this.handleEditChange(e) }
              onKeyDown = { e => {
                if (e.key.match(new RegExp("enter", "i"))) 
                  this.handleEditOk()
              }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={ () => this.handleEditOk() }>
              { intl.timer.editSubmit }
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}