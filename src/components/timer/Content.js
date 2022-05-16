import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import TableViewIcon from '@mui/icons-material/TableView'
import { TimerObj } from '../../constants/customData'
import { query, renew, update } from '../../utils/fetchData'
import Footer from '../common/Footer'
import CheckList from './CheckList'
import SortedList from './SortedList'
import MonsterCard from './MonsterCard'

const combinedTimer = (ts, ms) => {
  if (!ts || !ms) return ts

  let arr = []
  ts.forEach(obj => {
    let mons = ms.find(m => m.id == obj.id)
    if (mons) arr.push(Object.assign(obj, mons))
  })
  return arr
}

const sortByAppearTime = list => {
  let newList = list.filter(m => !!m.utcMSEC)
  newList.sort((a, b) => a.utcMSEC - b.utcMSEC)
  return newList
}

export default function Content({ intl }) {
  const [ monsters, setMonsters ]       = useState([])
  const [ timers, setTimers ]           = useState([])
  const [ sorted, setSorted ]           = useState([])
  const [ isSaved, setIsSaved ]         = useState(false)
  const [ isCheckOpen, setIsCheckOpen ] = useState(false)
  const [ isSortOpen, setIsSortOpen ]   = useState(false)

  useEffect(() => {
    query("/api/monsters")
      .then(mons => {
        if (mons && mons.length) {
          query("/api/timers")
            .then(data => {
              let list = combinedTimer(data, mons)
              setTimers(list)
              setSorted(sortByAppearTime(list))
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
    setSorted(sortByAppearTime(mons))
  }

  const saveTimers = () => {
    if (!isSaved) {
      const data = timers.map(m => TimerObj(m))
      renew("/api/timers", data).then(() => {
        setIsSaved(true)
        setIsCheckOpen(false)
      })
    } else {
      setIsCheckOpen(false)
    }
  }

  const updateTimer = status => {
    update("/api/timers", status).then(data => {
      let list = combinedTimer(data, monsters)
      setTimers(list)
      setSorted(sortByAppearTime(list))
    })
  }

  const MonstarList = list => {
    return list.map(mon => (
      <MonsterCard 
        intl    = { intl }
        key     = { `${ mon.id }${ mon.roId }` } 
        monster = { mon }
        onChange= { updateTimer }
      />
    ))
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

        <div className="list">
          { timers.length > 0 && MonstarList(timers) }
        </div>
      </main>

      <Footer copyright={ intl.copyright }/>

      <SortedList 
        intl   = { intl }
        open   = { isSortOpen }
        number = { sorted.length }
        onOpen = { setIsSortOpen }
      >
        { sorted.length > 0 && MonstarList(sorted) }
      </SortedList>

      <Drawer
        anchor  = "bottom"
        open    = { isCheckOpen }
        onClose = { () => saveTimers() }
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