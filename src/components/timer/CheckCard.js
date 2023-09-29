import { memo } from 'react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import AlarmOnIcon from '@mui/icons-material/AlarmOn'
import BossIcon from './BossIcon'
import { getFormatedTime } from '../../constants/dateTime'
import { toClassStr } from '../../utils/parser'

function CheckCard({ intl, monster, isChecked, onCheck }) {
  const img = monster.image ? monster.image : "egg.png"
  return (
    <Card className="check-card">
      <CardActionArea
        className = { toClassStr("check-area", monster.isStarting && "timer") }
        onClick   = { () => onCheck(monster, !isChecked) }
      >
        <div className="avatar">
          <div>
            <img
              src = { `/static/images/${ img }` }
              alt = { monster.name }
            />
          </div>
          
          <div>
            <div className="desc">
              <span>{ `ID ${ monster.roId }` }</span>
            </div>

            <div className="desc">
              <BossIcon isMVP={ monster.isMVP } />
              <span>{ `Lv.${ monster.level }` }</span>
            </div>

            <div className="desc">
              <span>{ monster.race }</span>
              <span>{ monster.element }</span>
              <span>{ monster.size }</span>
            </div>
          </div>
        </div>
        
        <div className="info">
          <div className="name">
            <span>{ monster.name }</span>

            <div>
              { 
                monster.isStarting
                ? <AlarmOnIcon />
                : isChecked
                  ? <CheckBoxIcon className="check" /> 
                  : <CheckBoxOutlineBlankIcon />
              }
            </div>
          </div>
          
          <div className="desc">
            <span>{ intl.timer.respawn }</span>
            <span>{ getFormatedTime(monster.msec) }</span>
          </div>
          
          <div className="desc">
            <span>{ monster.location }</span>
          </div>
        </div>
      </CardActionArea>
    </Card>
  )
}

export default memo(CheckCard)