import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import SearchIcon from '@mui/icons-material/Search'
import { TimerObj } from '../../constants/dataFormat'
import { SECOND } from '../../constants/dateTime'
import { trimStr, template, isChanged } from '../../utils/parser'
import DrawerContainer from '../common/DrawerContainer'
import CheckCard from './CheckCard'

export default function CheckDrawer({ 
  intl, isOpen, monsters, timers, onClose 
}) {
  const [leftList, setLeftList]           = useState(monsters)
  const [checkedTimers, setCheckedTimers] = useState(timers)
  const [searchText, setSearchText]       = useState("")
  const [showMessage, setShowMessage]     = useState(false)
  const [selectedTab, setSelectedTab]     = useState("mvp")

  useEffect(() => {
    if (isChanged(timers, checkedTimers)) setCheckedTimers(timers)
  }, [timers])

  const search = keywords => {
    const word = trimStr(keywords)
    const newList = monsters.filter(mon => 
      mon.roId.toString().match(new RegExp(word, "i")) || 
      mon.name.match(new RegExp(word, "i")) ||
      (mon.location && mon.location.match(new RegExp(word, "i")))
    )
    
    setLeftList(word.length > 0 ? newList : monsters)
  }

  const changeList = (monster, isAdd) => {
    let newList = Array.from(checkedTimers)
    if (isAdd)
      newList.push(TimerObj(monster))
    else
      newList = newList.filter(mon => mon.id != monster.id)

    setCheckedTimers(newList)
    setShowMessage(true)
  }

  const handleChange = value => {
    setSearchText(value)
    search(value)
  }

  const handleClose = () => {
    onClose(checkedTimers.sort((a, b) => a.id - b.id))
    setShowMessage(false)
  }

  const message = template(intl.timer.checkMsg, checkedTimers.length, monsters.length)
  
  const checkedMap = checkedTimers.reduce((previous, current) => {
    previous[current.id] = !!current.utcMSEC
    return previous
  }, {})

  const listMap = leftList.reduce((previous, current) => {
    if (current.isMVP) previous.mvp.push(current)
    else previous.mini.push(current)

    if (current.id in checkedMap) previous.checked.push(current)
    return previous
  }, { mvp: [], mini: [], checked: [] })

  return (
    <DrawerContainer
      className = "check-drawer"
      intl      = { intl }
      anchor    = "bottom"
      isOpen    = { isOpen }
      onClose   = { () => handleClose() }
      header    = {
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
            onChange        = { e => handleChange(e.target.value) }
          />
        </div>
      }
    >
      <div>
        <Tabs
          centered
          className = "check-tabs"
          aria-label= "mvp, mini, selected tabs"
          value     = { selectedTab }
          onChange  = { (event, value) => setSelectedTab(value) } 
        >
          <Tab 
            label = { `MVP (${ listMap.mvp.length })` } 
            value = "mvp"
          />

          <Tab 
            label = { `MINI (${ listMap.mini.length })` } 
            value = "mini"
          />

          <Tab 
            label = { `${ intl.timer.selected } (${ listMap.checked.length })` } 
            value = "checked"
          />
        </Tabs>
        
        <div 
          role      = "tabpanel"
          className = "list"
        >
          { 
            listMap[selectedTab].map(mon => 
              <CheckCard 
                intl      = { intl }
                key       = { `${ selectedTab }-${ mon.id }-${ mon.roId }` } 
                monster   = { mon }
                isChecked = { mon.id in checkedMap }
                isStarting= { checkedMap[mon.id] }
                onCheck   = { changeList }
              />
            )
          }
        </div>
      </div>

      <Snackbar
        className       = "check-message"
        anchorOrigin    = { { vertical: "bottom", horizontal: "center" } }
        open            = { showMessage }
        key             = { message }
        message         = { message }
        autoHideDuration= { 3 * SECOND }
        onClose         = { () => setShowMessage(false) }
      />
    </DrawerContainer>
  )
}