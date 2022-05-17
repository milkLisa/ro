import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import { trimStr, template } from '../../utils/parser'
import DrawerContainer from '../common/DrawerContainer'
import CheckCard from './CheckCard'

export default function CheckDrawer({ 
  intl, isOpen, monsters, checkedMons, onClose, onCheck 
}) {
  const [ leftList, setLeftList ]       = useState(monsters)
  const [ checkedList, setCheckedList ] = useState(checkedMons)
  const [ count, setCount ]             = useState(checkedMons.length)
  const [ searchText, setSearchText]    = useState("")

  useEffect(() => {
    setCheckedList(checkedMons)
    setCount(checkedMons.length)
  }, [checkedMons])

  const search = keywords => {
    setSearchText(keywords)

    const word = trimStr(keywords)
    const newList = monsters.filter(mon => 
      mon.roId.toString().match(new RegExp(word, "i")) || 
      mon.name.match(new RegExp(word, "i"))
    )
    
    setLeftList(word.length > 0 ? newList : monsters)
  }

  const changeList = (monster, isAdd) => {
    if(isAdd) 
      checkedList.push(monster)
    else 
      checkedList = checkedList.filter(mon => mon.id != monster.id)

    checkedList.sort((a, b) => a.id - b.id)
    setCheckedList(checkedList)
    setCount(checkedList.length)
    onCheck(checkedList)
  }

  return (
    <DrawerContainer
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
      onClose = { () => onClose() }
    >
      <div>{ template(intl.timer.checked, count, monsters.length) }</div>

      <div className="list">
        { 
          leftList.map(mon => {
            const checked = checkedList.find(item => item.id == mon.id)

            return (<CheckCard 
              key       = { `${ mon.id }${ mon.roId }` } 
              monster   = { checked || mon }
              intl      = { intl }
              isChecked = { !!checked }
              onCheck   = { changeList }
            />)
          })
        }
      </div>
    </DrawerContainer>
  )
}