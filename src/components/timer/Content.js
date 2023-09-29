import { useState } from 'react'
import Button from '@mui/material/Button'
import TableViewIcon from '@mui/icons-material/TableView'
import * as gtag from '../../lib/gtag'
import CheckDrawer from './CheckDrawer'
import TimerList from './TimerList'
import { TimerObj } from '../../constants/dataFormat'
import * as fetchData from '../../utils/fetchData'
import { isChanged } from '../../utils/parser'

const combine = (timers, monsters) => {
  if (!timers || !monsters) return timers

  let arr = []
  timers.forEach(obj => {
    let monster = monsters.find(m => m.id == obj.id)
    if (monster) arr.push(Object.assign({}, obj, monster))
  })
  return arr
}

export default function Content({ intl, monsters, defaultTimers, settings, audios }) {
  const [timers, setTimers] = useState(defaultTimers)
  const [selectedTimers, setSelectedTimers] = useState(combine(defaultTimers, monsters))
  const [isCheckOpen, setIsCheckOpen] = useState(false)

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
      setSelectedTimers(combine(newTimers, monsters))
      fetchData.renew("/api/timers", newTimers)

      gtag.event("Add/Delete Timers", "Check Timers", JSON.stringify(newTimers))
    }
  }

  const updateTimers = list => {
    let objs = list.map(t => TimerObj(t))
    setTimers(objs)
    fetchData.renew("/api/timers", objs)
  }
  
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
          intl            = { intl }
          selectedTimers  = { selectedTimers }
          settings        = { settings }
          audios          = { audios }
          onChange        = { updateTimers }
        />
      </main>
      
      <CheckDrawer
        intl        = { intl }
        isOpen      = { isCheckOpen }
        timers      = { isCheckOpen ? [...timers] : [] }
        monsters    = { monsters }
        onClose     = { saveTimers }
      />
    </>
  )
}