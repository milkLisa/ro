import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import Header from '../../components/common/Header'
import BottomBar from '../../components/timer/BottomBar'
import { TimerObj } from '../../constants/customData'
import { query, renew, update } from '../../utils/fetchData'
import TimerList from './TimerList'
import CheckList from './CheckList'

const combinedTimer = (ts, ms) => {
  let arr = []
  ts.forEach(obj => {
    let mons = ms.find(m => m.id == obj.id)
    if (mons) arr.push(Object.assign(obj, mons))
  })
  return arr
}

export default function TimerContainer({ intl }) {
  const [ monsters, setMonsters ] = useState([])
  const [ timers, setTimers ]     = useState([])
  const [ isOpen, setIsOpen ]     = useState(false)
  const [ isChange, setIsChange ] = useState(false)

  useEffect(() => {
    query("/api/monsters")
      .then(mons => {
        query("/api/timers")
          .then(data => {
            setTimers(combinedTimer(data, mons))
            setMonsters(mons)
          })
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

  if (!monsters || !monsters.length)
    return <Container className="container">{ intl.home.loading }</Container>

  return (
    <Container className="timer-container">
      <Header title={ intl.timer.title } />

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
    </Container>
  )
}