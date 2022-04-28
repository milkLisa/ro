import { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { getFormatedTime } from '../../constants/date_time'

export default function CheckCard({ langContent, monster, isChecked, onCheck }) {
  const [ checked, setChecked ] = useState(isChecked)

  useEffect(() => setChecked(isChecked), [isChecked])

  const check = () => {
    setChecked(!checked)
    onCheck(monster, !checked)
  }

  return (
    <div className="check-card">
      <IconButton
        aria-label     = "check timer"
        className      = "check-btn"
        disableRipple  = { true }
        onClick        = { () => check()  }
      >
        { checked
          ? <CheckBoxIcon className="check"/> 
          : <CheckBoxOutlineBlankIcon/> 
        }
      </IconButton>

      <div>
        <div className="name">
          <span>{ monster.name }</span>
        </div>
        
        <div className="note">
          <span>{ monster.isMVP ? "MVP" : "Boss" }</span>
          <span>{ `Lv.${ monster.level }` }</span>
          <span>{ `ID ${ monster.roId }` }</span>
          <span>{ monster.race }</span>
          <span>{ monster.element }</span>
          <span>{ monster.size }</span>
        </div>

        <div className="respwan">
          <span>{
           `${ langContent.mvp.respwan } ${ getFormatedTime(monster.msec) }` 
          }</span>
        </div>
        
        <div className="location">
          <span>{ monster.location }</span>
        </div>
      </div>
    </div>
  )
}