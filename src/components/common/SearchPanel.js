import { useState, memo } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { toClassStr, trimStr } from '../../utils/parser'

function SearchPanel({ 
  className, source = [], fields = [], placeholder, onSearch
}) {
  const [searchText, setSearchText] = useState("")

  const handleChange = keywords => {
    const word = trimStr(keywords)
    let newList = [...source]
    let isFilter = false
    
    if (word.length > 0) {
      newList = source.filter(item =>
        fields.some(value => trimStr(item[value]).match(new RegExp(word, "i")))
      )
      isFilter = true
    }
    
    onSearch(newList, isFilter)
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
        autoComplete= "off"
        fullWidth   = { true }
        margin      = "none"
        variant     = "outlined"
        label       = { placeholder }
        value       = { searchText }
        className   = "search-field"
        onChange    = { e => setSearchText(e.target.value) }
        onKeyUp     = { e => handleChange(e.target.value) }
      />
      
      <IconButton
        className = "clear-btn"
        aria-label= "clear search text"
        onClick   = { () => handleChange("") }
      >
        <HighlightOffIcon />
      </IconButton>
    </div>
  )
}

export default memo(SearchPanel)