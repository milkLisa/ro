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

  const img = monster.image ? monster.image : "egg.png"

  return (
    <div className="check-card">
      <div className="avatar">
        <div>
          <img
            src = { `/static/images/${ img }` }
            alt = { monster.name }
          />
        </div>
        
        <div>
          <div className="note">
            <span>{ `ID ${ monster.roId }` }</span>
          </div>

          <div className="desc">
            <span>{ monster.isMVP ? "MVP" : "Boss" }</span>
            <span>{ `Lv.${ monster.level }` }</span>
          </div>

          <div className="note">
            <span>{ monster.race }</span>
            <span>{ monster.element }</span>
            <span>{ monster.size }</span>
          </div>
        </div>
      </div>
      
      <div className="info">
        <div className="name">
          <span>{ monster.name }</span>

          <IconButton
            aria-label = "check timer"
            onClick    = { () => check()  }
          >
            { checked
              ? <CheckBoxIcon className="check"/> 
              : <CheckBoxOutlineBlankIcon/> 
            }
          </IconButton>
        </div>
        
        <div className="desc">
          <span>{ langContent.mvp.respwan }</span>
          <span>{ getFormatedTime(monster.msec) }</span>
        </div>
        
        <div className="desc">
          <span>{ monster.location }</span>
        </div>
      </div>
    </div>
  )
}