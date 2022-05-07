import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TableViewIcon from '@mui/icons-material/TableView'
import { queryData, setData } from '../../utils/ajax'
import CheckList from './CheckList'
import MonsterCard from './MonsterCard'

const combinedTimer = (ts, ms) => {
  let arr = []
  ts.forEach(obj => {
    let mons = ms.find(m => m.id == obj.id)
    if (mons) arr.push(Object.assign(obj, mons))
  })
  return arr
}

export default function TimerList({ intl }) {
  const [ monsters, setMonsters ] = useState([])
  const [ timers, setTimers ]     = useState([])
  const [ isOpen, setIsOpen ]     = useState(false)

  useEffect(() => {
    queryData("/api/monsters")
      .then(mons => {
        queryData("/api/timers")
          .then(data => {
            setTimers(combinedTimer(data, mons))
            setMonsters(mons)
          })
      })
  }, [])

  const saveTimers = () => {
    const data = timers.map(m => { return { id: m.id, utcMSEC: m.utcMSEC || null } })
    
    setData("/api/timers", data).then(() => setIsOpen(false))
  }

  if (!monsters || !monsters.length) 
    return <Container className="container">{ intl.main.loading }</Container>

  return (
    <Container className="container">
      <div>
        <span>{ intl.timer.checkTimer }</span>
        <IconButton
          aria-label  = "add timer"
          className   = "big-btn"
          onClick     = { () => setIsOpen(true) }
        >
          <TableViewIcon />
        </IconButton>

        <Drawer
          anchor      = "bottom"
          open        = { isOpen }
          onClose     = { () => saveTimers() }
        >
          <CheckList
            intl        = { intl }
            checkedMons = { timers }
            monsters    = { monsters }
            onClose     = { () => saveTimers() }
            onCheck     = { mons => setTimers(mons) }
          />
        </Drawer>
      </div>

      <div className="list">
        { 
          timers.map(mon => (
            <MonsterCard 
              intl    = { intl }
              key     = { `${ mon.id }${ mon.roId }` } 
              monster = { mon }
            />
          ))
        }
      </div>
    </Container>
  )
}