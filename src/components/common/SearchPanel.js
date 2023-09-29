import { useState, memo } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import { toClassStr, trimStr } from '../../utils/parser'

function SearchPanel({ 
  className, source = [], fields = [], placeholder, onSearch
}) {
  const [searchText, setSearchText] = useState("")

  const handleChange = keywords => {
    const word = trimStr(keywords)
    let newList = [...source]
    
    if (word.length > 0) {
      newList = source.filter(item =>
        fields.some(value => trimStr(item[value]).match(new RegExp(word, "i")))
      )
    }
    
    onSearch(newList)
    setSearchText(keywords)
  }

  return (
    <div className={ toClassStr("search-panel", className) }>
      <IconButton
        aria-label= "search"
        className = "search-btn"
      >
        <SearchIcon />
      </IconButton>

      <TextField
        autoComplete    = "off"
        fullWidth       = { true }
        margin          = "none"
        variant         = "outlined"
        placeholder     = { placeholder }
        value           = { searchText }
        className       = "search-field"
        onChange        = { e => handleChange(e.target.value) }
      />
    </div>
  )
}

export default memo(SearchPanel)