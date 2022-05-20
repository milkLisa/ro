import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { TimerObj } from '../../constants/customData'
import { 
  MINUTE, SECOND, getFormatedTime, getDateTime, parseToMSEC
} from '../../constants/dateTime'
import { isValid } from '../../utils/parser'

export default function MonsterCard({ 
  intl, monster, settings, onStart, onStop 
}) {
  const [isEdit, setIsEdit]     = useState(false)
  const [editText, setEditText] = useState("")
  const defaultTime = monster.editMSEC || monster.msec
  const isStart = isValid(monster.utcMSEC)
  const leftTime = monster.leftTime || defaultTime
  const img = "/static/images/" + (monster.image ? monster.image : "egg.png")
  
  const getClass = (stable, isStart, time) => {
    let classArr = [stable]

    if(isStart) {
      classArr.push("timer")

      if(time < 0)
        classArr.push("appeared")
      else if (time < (parseToMSEC(settings.remindBefore) || MINUTE))
        classArr.push("alert")
    }

    return classArr.join(" ")
  }

  const handleSwitch = turnOn => {
    if (turnOn) {
      onStart(TimerObj(monster, { utcMSEC: defaultTime + Date.now() }))
    } else {
      onStop(TimerObj(monster, { utcMSEC: null }))
    }
  }

  const openEditBox = e => {
    e.preventDefault()
    setIsEdit(true)
    return false
  }

  const handleEditChange = e => {
    setEditText(e.target.value)
  }

  const handleEditClose = () => {
    setIsEdit(false)
    setEditText("")
  }

  const handleEditOk = () => {
    let msec = parseToMSEC(editText)
    msec = msec < SECOND ? defaultTime : msec

    onStart(TimerObj(monster, 
      { utcMSEC: msec + Date.now(), editMSEC: msec }
    ))

    handleEditClose()
  }

  const showField = (setting, value) => {
    return setting ? value : ""
  }

  return (
    <div className={ getClass("monster-card", isStart, leftTime) }>
      <div 
        className = "avatar"
        onClick   = { () => handleSwitch(!isStart) }
        onContextMenu = { e => openEditBox(e) }
      >
        <div className="time">
          { getFormatedTime(leftTime) }
        </div>

        <style jsx>{`
          .avatar {
            background-image: url(${img});
          }
        `}</style>
      </div>

      <div className="info">
        <div>{ showField(settings.showName, monster.name) }</div>
        
        
        { showField(settings.showLocation, 
          <div className="location">{ monster.location }</div>) }
        
        <div>
          { showField(settings.showDateTime, getDateTime(monster.utcMSEC)) }
        </div>
      </div>

      <Dialog 
        className = "edit-dialog"
        open      = { isEdit } 
        onClose   = { () => handleEditClose() }
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
            onChange  = { e => handleEditChange(e) }
            onKeyDown = { e => {
              if (e.key.match(new RegExp("enter", "i"))) handleEditOk()
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={ () => handleEditOk() }>
            { intl.timer.editSubmit }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}