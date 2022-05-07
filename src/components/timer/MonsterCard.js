import { Component } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { updateData } from '../../utils/ajax'
import { 
  MINUTE, SECOND, getFormatedTime, parseToMSEC 
} from '../../constants/dateTime'

export default class MonsterCard extends Component {
  state = {
    isStart: false,
    isEdit: false,
    editText: "",
    defaultTime: this.props.monster.msec,
    time: this.initTime()
  }

  componentDidMount() {
    const { monster } = this.props
    const { time } = this.state
    if (monster.utcMSEC) {
      time == monster.msec 
      ? updateData("/api/timers", { id: monster.id, utcMSEC: null }) 
      : this.switch(true, true)
    }
  }

  componentWillUnmount() {
    this.switch(false)
  }

  initTime() {
    const { monster } = this.props
    const msec = monster.utcMSEC ? monster.utcMSEC - Date.now() : 0
    return msec < SECOND ? monster.msec : msec
  }

  timing() {
    const { time } = this.state
    time <= -MINUTE ? this.switch(false) : this.setState({ time: time - SECOND })
  }

  switch(on, dontSave) {
    if (on) {
      this.timer = setInterval(() => this.timing(), SECOND)
      this.setState({ isStart: true })
    } else {
      if (this.timer) clearInterval(this.timer)
      this.setState({ isStart: false, time: this.state.defaultTime })
    }

    if (!dontSave) {
      const { monster } = this.props
      const msec = on ? monster.msec + Date.now() : null
      updateData("/api/timers", { id: monster.id, utcMSEC: msec })
    }
  }

  editTime(e) {
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
    const { monster } = this.props
    const msec = parseToMSEC(editText)
    this.setState({ 
      isEdit: false, 
      editText: "", 
      time: msec < SECOND ? monster.msec : msec 
    })
  }

  render() {
    const { monster, intl } = this.props
    const { isStart, isEdit, editText, time } = this.state
    const img = "/static/images/" + (monster.image ? monster.image : "egg.png")
    
    return (
      <div className={ `monster-card${ 
          isStart ? " timer" : "" 
        }${ 
          time < 0 ? " appeared" : time < MINUTE ? " alert" : ""
        }` 
      }>
        <div 
          className = "avatar"
          onClick   = { () => this.switch(!isStart) }
          onContextMenu = { e => this.editTime(e) }
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
              onKeyDown       = { e => {
                if (e.key.match(new RegExp("enter", "i"))) this.handleEditOk()
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleEditOk() }>
              { intl.timer.editSubmit }
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}