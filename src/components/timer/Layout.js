import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import { TimerObj } from '../../constants/customData'
import { query, renew, update } from '../../utils/fetchData'
import TimerList from './TimerList'
import BottomBar from './BottomBar'
import CheckList from './CheckList'

const combinedTimer = (ts, ms) => {
  let arr = []
  ts.forEach(obj => {
    let mons = ms.find(m => m.id == obj.id)
    if (mons) arr.push(Object.assign(obj, mons))
  })
  return arr
}

export default function Layout({ intl }) {
  const [ monsters, setMonsters ] = useState(null)
  const [ timers, setTimers ]     = useState([])
  const [ isOpen, setIsOpen ]     = useState(false)
  const [ isChange, setIsChange ] = useState(false)

  useEffect(() => {
    query("/api/monsters")
      .then(mons => {
        if (mons.length) {
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
    setIsChange(true)
    setTimers(mons)
  }

  const saveTimers = () => {
    if (isChange) {
      const data = timers.map(m => TimerObj(m))
      renew("/api/timers", data).then(() => {
        setIsChange(false)
        setIsOpen(false)
      })
    } else {
      setIsOpen(false)
    }
  }

  const updateTimer = status => {
    update("/api/timers", status).then(data => {
      setTimers(combinedTimer(data, monsters))
    })
  }

  if (!monsters)
    return <main>{ intl.home.loading }</main>

  if (!monsters.length)
    return <main>{ intl.timer.emptyError }</main>

  return (
    <>
      <main>
        <TimerList
          intl     = { intl } 
          timers   = { timers }
          onChange = { status => updateTimer(status) }
        />
      </main>

      <BottomBar 
        intl    = { intl } 
        onClick = { () => setIsOpen(true) } 
      />

      <Drawer
        anchor      = "bottom"
        ModalProps  = {{ keepMounted: true }}
        open        = { isOpen }
        onClose     = { () => saveTimers() }
      >
        <CheckList
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