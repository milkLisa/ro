import { useState } from 'react'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TableViewIcon from '@mui/icons-material/TableView'
import CheckList from './CheckList'
import MonsterCard from './MonsterCard'

export default function TimerList({ intl }) {
  const [ monsters, setMonsters ] = useState([])
  const [ isOpen, setIsOpen ]     = useState(false)

  const getMonsId = () => {
    let ids = []
    monsters.forEach(mon => ids.push(mon.id))
    return ids
  }

  return (
    <Container className="container">
      <div>
        <IconButton
          aria-label  = "add timer"
          className   = "big-btn"
          onClick     = { () => setIsOpen(true)  }
        >
          <TableViewIcon />
        </IconButton>

        <Drawer
          anchor      = "bottom"
          ModalProps  = {{ keepMounted: true }}
          open        = { isOpen }
          onClose     = { () => setIsOpen(false) }
        >
          <CheckList
            intl        = { intl }
            checkedMons = { getMonsId() }
            onClose     = { () => setIsOpen(false) }
            onCheck     = { monsters => setMonsters(monsters) }
          />
        </Drawer>
      </div>

      <div className="list">
        { 
          monsters.map(mon => (
            <MonsterCard 
              intl    = { intl }
              key     = { `${ mon.id }` } 
              monster = { mon }
            />
          ))
        }
      </div>
    </Container>
  )
}