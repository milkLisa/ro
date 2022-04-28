import { useState } from 'react'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import CheckList from './CheckList'
import TimerCard from './TimerCard'

export default function TimerList({ langContent }) {
  const [ monsters, setMonsters ] = useState([])
  const [ isOpen, setIsOpen ]     = useState(false)

  const getMonsId = () => {
    let ids = []
    monsters.forEach(mon => ids.push(mon.id))
    return ids
  }

  return (
    <Container className="container">
      <div className="">
        <IconButton
          variant   = "contained"
          className = "add-btn"
          onClick   = { () => setIsOpen(true)  }
        >
          <AddIcon />
        </IconButton>

        <Drawer
          anchor ="bottom"
          open   ={ isOpen }
          onClose={ () => setIsOpen(false) }
        >
          <CheckList
            langContent = { langContent }
            checkedMons = { getMonsId() }
            onClose     = { () => setIsOpen(false) }
            onCheck     = { monsters => setMonsters(monsters) }
          />
        </Drawer>
      </div>

      <div className="list">
        { 
          monsters.map(mon => (
            <TimerCard 
              key     = { `${ mon.id }` } 
              monster = { mon }
            />
          ))
        }
      </div>
    </Container>
  )
}