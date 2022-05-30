import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import TableViewIcon from '@mui/icons-material/TableView'
import { TimerObj } from '../../constants/customData'
import { query, renew } from '../../utils/fetchData'
import { isChanged } from '../../utils/parser'
import Loading from '../common/Loading'
import CheckDrawer from './CheckDrawer'
import TimerList from './TimerList'

const combinedTimer = (ts, ms) => {
  if (!ts || !ms) return ts

  let arr = []
  ts.forEach(obj => {
    let mons = ms.find(m => m.id == obj.id)
    if (mons) arr.push(Object.assign({}, obj, mons))
  })
  return arr
}

export default function Content({ intl, settings }) {
  const [ monsters, setMonsters ]       = useState([])
  const [ timers, setTimers ]           = useState([])
  const [ isCheckOpen, setIsCheckOpen ] = useState(false)

  useEffect(() => {
    query(["/api/monsters", "/api/timers"])
      .then(data => {
        setTimers(data.timers)
        setMonsters(data.monsters)
      })
  }, [])

  const saveTimers = newTimers => {
    const ids = timers.map(t => t.id)
    let newIds = []
    newTimers = newTimers.reduce((previous, current) => {
      if (ids.includes(current.id)) {
        previous.push(timers.find(t => t.id == current.id))
      } else {
        previous.push(TimerObj(current))
      }

      newIds.push(current.id)
      return previous
    }, [])

    setIsCheckOpen(false)

    if (isChanged(ids, newIds)) {
      setTimers(newTimers)
      renew("/api/timers", newTimers)
    }
  }

  const updateTimers = list => {
    let objs = list.map(t => TimerObj(t))
    setTimers(objs)
    renew("/api/timers", objs)
  }

  if (!settings || !monsters || !timers)
    return <main>{ intl.timer.emptyError }</main>

  if (!monsters.length)
    return <main><Loading /></main>

  return (
    <>
      <main>
        <Button 
          className = "add-btn"
          aria-label= "add timers"
          variant   = "contained"
          disableFocusRipple
          endIcon   = { <TableViewIcon /> }
          onClick   = { () => setIsCheckOpen(true) } 
        >
          { intl.timer.checkTimer }
        </Button>
        
        <TimerList 
          intl      = { intl }
          monTimers = { combinedTimer(timers, monsters) }
          settings  = { settings }
          onChange  = { updateTimers }
        />
      </main>
      
      <CheckDrawer
        intl        = { intl }
        isOpen      = { isCheckOpen }
        timers      = { timers }
        monsters    = { monsters }
        onClose     = { saveTimers }
      />
    </>
  )
}