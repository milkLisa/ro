import React from 'react'
import useSWR from 'swr'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Search from '@mui/icons-material/Search'
import { trimStr } from '../../utils/parser'
import MonsterCard from '../../components/timer/monster_card'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function MonsterList({ langContent }) {
  const [ monList, setMonList ]       = React.useState(null)
  const [ searchText, setSearchText]  = React.useState("")

  const { data: monsters } = useSWR("/api/monsters", fetcher)
  
  const getMons = () => {
    if (monList) return monList

    return monsters && monsters.filter(mon => mon.isMVP) || []
  }

  const search = keywords => {
    setSearchText(keywords)

    const word = trimStr(keywords)
    const newList = monsters.filter(mon => 
      mon.id.toString().match(new RegExp(word, "i")) || 
      mon.name.match(new RegExp(word, "i"))
    )
    
    setMonList(word.length > 0 ? newList : null)
  }

  return (
    <Container className="container">
      <div className="search-panel">
        <TextField
          autoComplete    = "off"
          fullWidth       = { true }
          margin          = "none"
          variant         = "outlined"
          placeholder     = { langContent.mvp.search }
          value           = { searchText }
          className       = "search-field"
          onChange        = { e => setSearchText(e.target.value) }
          onKeyDown       = { e => {
            if (`${e.keyCode}` === "13") search(e.target.value)
          }}
        />

        <IconButton
          variant   = "contained"
          className = "search-btn"
          onClick   = { () => search(searchText)  }
        >
          <Search />
        </IconButton>
      </div>
      {
        monsters ? 
        <div className="list">
          { 
            getMons().map((mon, index) => (
              <MonsterCard key={ `${ index }-${ mon.id }` } monster={ mon } />
            ))
          }
        </div>
        :
        <div>{ langContent.main.loading }</div>
      }
    </Container>
  )
}