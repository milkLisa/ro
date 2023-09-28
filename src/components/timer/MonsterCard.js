import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { 
  MINUTE, SECOND, getFormatedTime, getDateTime, parseToMSEC, isLessOrEqual
} from '../../constants/dateTime'
import BossIcon from './BossIcon'

export default function MonsterCard({ 
  intl, settings, monster, onSwitch, onTime 
}) {
  const [isEdit, setIsEdit]       = useState(false)
  const [editText, setEditText]   = useState("")
  const [isReminded, setIsReminded]= useState(false)

  const { showName, showLocation, showDateTime, remindBefore } = settings
  const { id, isMVP, name, location, msec, utcMSEC, editMSEC, image } = monster
  const defaultTime = editMSEC || msec
  const leftTime = monster.leftTime || defaultTime
  const isStart = !!utcMSEC
  const img = "/static/images/" + (image ? image : "egg.png")
  const before = parseToMSEC(remindBefore) || MINUTE
  
  useEffect(() => {
    if (!isReminded && isStart && isLessOrEqual(leftTime, before)) {
      onTime(id)
      setIsReminded(true)
    }
  })

  const getClass = (stable, isStart, time) => {
    let classArr = [stable]

    if(isStart) {
      classArr.push("timer")

      if(time < 0)
        classArr.push("appeared")
      else if (time < before)
        classArr.push("alert")
    }

    return classArr.join(" ")
  }

  const handleSwitch = turnOn => {
    onSwitch(turnOn, turnOn 
      ? { ...monster, utcMSEC: defaultTime + Date.now() }
      : { ...monster, utcMSEC: null, leftTime: null }
    )
  }

  const openEditBox = e => {
    e.preventDefault()
    setIsEdit(true)
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
    onSwitch(true, { ...monster, utcMSEC: msec + Date.now(), editMSEC: msec })
    handleEditClose()
  }

  return (
    <div className={ getClass("monster-card", isStart, leftTime) }>
      <div 
        className     = "avatar"
        onClick       = { () => handleSwitch(!isStart) }
        onDoubleClick = { e => openEditBox(e) }
        onContextMenu = { e => openEditBox(e) }
      >
        <BossIcon isMVP={ isMVP } />

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
        { showName && <div>{ name }</div> }
        { showLocation && <div className="location">{ location }</div> }
        { showDateTime && utcMSEC && <div>{ getDateTime(utcMSEC) }</div> }
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
            focused
            autoFocus
            fullWidth
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