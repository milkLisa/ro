import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import CheckCard from './CheckCard'
import { trimStr, format } from '../../utils/parser'

export default function CheckList({ intl, checkedMons, onClose, onCheck }) {
  const [ monsters, setMonsters ]       = useState([])
  const [ leftList, setLeftList ]       = useState([])
  const [ checkedList, setCheckedList ] = useState([])
  const [ count, setCount ]             = useState(0)
  const [ searchText, setSearchText]    = useState("")

  useEffect(() => {
    fetch("/api/monsters")
      .then((res) => res.json())
      .then((data) => {
        setMonsters(data)
        setLeftList(data)

        const list = data.filter(mon => checkedMons.includes(mon.id))
        setCheckedList(list)
        setCount(list.length)
      })
  }, [])

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
  
  if(!monsters.length) 
    return <Container className="container">{ intl.main.loading }</Container>

  return (
    <Container className="container">
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
        
        <IconButton
          aria-label  = "close"
          className   = "close-btn"
          onClick     = { () => onClose()  }
        >
          <CloseIcon />
          <span>ESC</span>
        </IconButton>
      </div>
      
      <div>{ format(intl.timer.checked, count, monsters.length) }</div>

      <div className="list">
        { 
          leftList.map(mon => (
            <CheckCard 
              key       = { `${ mon.id }` } 
              monster   = { mon }
              intl      = { intl }
              isChecked = { checkedList.includes(mon) }
              onCheck   = { changeList }
            />
          ))
        }
      </div>
    </Container>
  )
}