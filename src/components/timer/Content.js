import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import TableViewIcon from '@mui/icons-material/TableView'
import { TimerObj } from '../../constants/customData'
import { query, renew, update } from '../../utils/fetchData'
import CheckTable from './CheckTable'
import TimerList from './TimerList'

const combinedTimer = (ts, ms) => {
  if (!ts || !ms) return ts

  let arr = []
  ts.forEach(obj => {
    let mons = ms.find(m => m.id == obj.id)
    if (mons) arr.push(Object.assign(obj, mons))
  })
  return arr
}

export default function Content({ intl }) {
  const [ monsters, setMonsters ]       = useState([])
  const [ timers, setTimers ]           = useState([])
  const [ isSaved, setIsSaved ]         = useState(false)
  const [ isCheckOpen, setIsCheckOpen ] = useState(false)

  useEffect(() => {
    query("/api/monsters")
      .then(mons => {
        if (mons && mons.length) {
          query("/api/timers")
            .then(data => {
              setTimers(combinedTimer(data, mons))
              setMonsters(mons)
            })
        } else {
          setMonsters(mons)
        }
      })
  }, [])

  const checkTimer = mons => {
    setIsSaved(false)
    setTimers(mons)
  }

  const saveTimers = () => {
    if (!isSaved) {
      const list = timers.map(m => TimerObj(m))
      renew("/api/timers", list).then(data => {
        setIsSaved(true)
        setIsCheckOpen(false)
        setTimers(combinedTimer(data, monsters))
      })
    } else {
      setIsCheckOpen(false)
    }
  }

  const updateTimers = list => {
    renew("/api/timers", list).then(data => {
      setTimers(combinedTimer(data, monsters))
    })
  }

  if (!monsters || !timers)
    return <main>{ intl.timer.emptyError }</main>

  if (!monsters.length)
    return <main>{ intl.home.loading }</main>

  return (
    <>
      <main>
        <Button 
          className = "add-btn"
          aria-label= "add timers"
          variant   = "contained"
          endIcon   = { <TableViewIcon /> }
          onClick   = { () => setIsCheckOpen(true) } 
        >
          { intl.timer.checkTimer }
        </Button>
        
        <TimerList 
          intl    = { intl }
          timers  = { timers }
          onChange= { list => updateTimers(list) }
        />
      </main>
      
      <Drawer
        anchor  = "bottom"
        open    = { isCheckOpen }
        onClose = { () => saveTimers() }
      >
        <CheckTable
          intl        = { intl }
          checkedMons = { timers }
          monsters    = { monsters }
          onClose     = { () => saveTimers() }
          onCheck     = { mons => checkTimer(mons) }
        />
      </Drawer>
    </>
  )
}