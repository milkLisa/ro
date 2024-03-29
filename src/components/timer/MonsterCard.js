import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { 
  MINUTE, SECOND, HALF_SECOND, TIME_FORMAT,
  getFormatedTime, getDateTime, parseToMSEC, isLessOrEqual
} from '../../constants/dateTime'
import { trimStr } from '../../utils/parser'
import BossIcon from './BossIcon'

export default function MonsterCard({ 
  intl, settings, monster, onSwitch, onTime 
}) {
  const [isEdit, setIsEdit]        = useState(false)
  const [isError, setIsError]      = useState(false)
  const [editText, setEditText]    = useState("")
  const [isReminded, setIsReminded]= useState(false)
  const [touchTime, setTouchTime]  = useState(0)

  const { showName, showLocation, showMapCode, showDateTime, remindBefore } = settings
  const { id, isMVP, name, en_name, location, mapCode, msec, utcMSEC, editMSEC, image } = monster
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
    const text = trimStr(e.target.value)
    const isMatch = text.length > 0 ? text.match(TIME_FORMAT) : true
    setIsError(!isMatch)
    setEditText(text)
  }

  const handleEditClose = () => {
    setEditText("")
    setIsError(false)
    setIsEdit(false)
  }

  const handleEditOk = () => {
    let msec = parseToMSEC(editText)
    msec = msec < SECOND ? defaultTime : msec
    onSwitch(true, { ...monster, utcMSEC: msec + Date.now(), editMSEC: msec })
    handleEditClose()
  }

  const touchCheck = (e) => {
    e.preventDefault()
    const time = Date.now() - touchTime
    if (time < HALF_SECOND) {
      handleSwitch(!isStart)
    } else {
      openEditBox(e)
    }
  }

  return (
    <div className={ getClass("monster-card", isStart, leftTime) }>
      <div 
        className     = "avatar"
        onTouchStart  = { () => setTouchTime(Date.now()) }
        onTouchEnd    = { e => touchCheck(e) }
        onClick       = { () => handleSwitch(!isStart) }
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
        { showName && <div>{ intl.isEnglish ? en_name : name }</div> }
        { showLocation && <div className="location">{ location }</div> }
        { showMapCode && <div className="map-code">{ mapCode }</div> }
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
            error     = { isError }
            label     = { isError ? intl.timer.editError : "" }
            margin    = "none"
            type      = "tel"
            inputProps= {{ style: { textAlign: "right" } }}
            value     = { editText }
            onChange  = { e => handleEditChange(e) }
            onKeyDown = { e => {
              if (!isError && e.key.match(new RegExp("enter", "i"))) handleEditOk()
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={ () => handleEditClose() }>
            { intl.timer.editCancel }
          </Button>
          
          <Button
            onClick = { () => handleEditOk() }
            disabled= { isError }
          >
            { intl.timer.editSubmit }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}