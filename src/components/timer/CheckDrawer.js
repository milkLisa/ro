import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import { TimerObj } from '../../constants/customData'
import { isValid, trimStr, template } from '../../utils/parser'
import DrawerContainer from '../common/DrawerContainer'
import CheckCard from './CheckCard'

export default function CheckDrawer({ 
  intl, isOpen, monsters, timers, onClose 
}) {
  const [ leftList, setLeftList ]       = useState(monsters)
  const [ checkedList, setCheckedList ] = useState(timers)
  const [ searchText, setSearchText]    = useState("")

  useEffect(() => setCheckedList(timers) , [timers])

  const search = keywords => {
    const word = trimStr(keywords)
    const newList = monsters.filter(mon => 
      mon.roId.toString().match(new RegExp(word, "i")) || 
      mon.name.match(new RegExp(word, "i"))
    )
    
    setLeftList(word.length > 0 ? newList : monsters)
  }

  const changeList = (monster, isAdd) => {
    let newList = Array.from(checkedList)
    if(isAdd) 
      newList.push(TimerObj(monster))
    else 
      newList = newList.filter(mon => mon.id != monster.id)

    setCheckedList(newList)
  }

  return (
    <DrawerContainer
      intl    = { intl }
      anchor  = "bottom"
      isOpen  = { isOpen }
      header  = {
        <div className="search-panel">
          <IconButton
            aria-label= "search"
            className = "search-btn"
            onClick   = { () => search(searchText)  }
          >
            <SearchIcon />
          </IconButton>

          <TextField
            autoComplete    = "off"
            fullWidth       = { true }
            margin          = "none"
            variant         = "outlined"
            placeholder     = { intl.timer.search }
            value           = { searchText }
            className       = "search-field"
            onChange        = { e => setSearchText(e.target.value) }
            onKeyDown       = { e => {
              if (e.key.match(new RegExp("enter", "i"))) search(e.target.value)
            }}
          />
        </div>
      }
      onClose = { () => onClose(checkedList.sort((a, b) => a.id - b.id)) }
    >
      <div>
        { template(intl.timer.checked, checkedList.length, monsters.length) }
      </div>

      <div className="list">
        { 
          leftList.map(mon => {
            const checked = checkedList.find(c => c.id == mon.id)

            return (<CheckCard 
              key       = { `${ mon.id }${ mon.roId }` } 
              monster   = { mon }
              intl      = { intl }
              isChecked = { !!checked }
              isStarting= { checked && isValid(checked.utcMSEC) }
              onCheck   = { changeList }
            />)
          })
        }
      </div>
    </DrawerContainer>
  )
}