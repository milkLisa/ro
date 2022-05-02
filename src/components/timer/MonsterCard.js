import { Component } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { 
  DAY, SECOND, getFormatedTime, parseToMSEC 
} from '../../constants/dateTime'

export default class MonsterCard extends Component {
  state = {
    isStart: false,
    isEdit: false,
    editText: "",
    time: this.props.monster.msec
  }

  componentWillUnmount() {
    this.switch(false)
  }

  timing() {
    const { time } = this.state
    time < -DAY ? this.switch(false) : this.setState({ time: time - SECOND })
  }

  switch(on) {
    if (on) {
      this.timer = setInterval(() => this.timing(), SECOND)
      this.setState({ isStart: true })
    } else {
      clearInterval(this.timer)
      this.setState({ isStart: false, time: this.props.monster.msec })
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
      <div className={ `monster-card${ isStart ? " timer" : "" }` }>
        <div 
          className = "avatar"
          onClick   = { () => this.switch(!isStart) }
          onContextMenu = { e => this.editTime(e) }
        >
          <div className={ 
            `time${ isStart ? " timer" : "" }${ time < 0 ? " appeared" : "" }` 
          }>
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

          <div className="note">{ `ID ${ monster.roId }` }</div>
          
          <div className="location">{ monster.location }</div>
        </div>

        <Dialog 
          className = "edit-dialog"
          open      = { isEdit } 
          onClose   = { () => this.handleEditClose() }
        >
          <DialogTitle>{ intl.mvp.editTitle }</DialogTitle>
          <div className="desc">
            { intl.mvp.editDesc }
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
              { intl.mvp.editSubmit }
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}