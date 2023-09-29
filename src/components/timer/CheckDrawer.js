import { useEffect, useReducer, useRef, memo } from 'react'
import Snackbar from '@mui/material/Snackbar'
import DrawerContainer from '../common/DrawerContainer'
import SearchPanel from '../common/SearchPanel'
import CheckTabs from './CheckTabs'
import { TimerObj, assignValue } from '../../constants/dataFormat'
import { SECOND } from '../../constants/dateTime'
import { template, isChanged, skipEvents } from '../../utils/parser'

const searchFields = ["roId", "name", "location"]

const buildItems = currentState => {
  const { timers, leftList } = currentState
  const checkedMap = timers.reduce((previous, current) => {
    previous[current.id] = !!current.utcMSEC
    return previous
  }, {})

  let mvp = [], mini = [], checked = []
  leftList.forEach(monster => {
    if (monster.id in checkedMap) {
      monster.isChecked = true
      monster.isStarting = checkedMap[monster.id]
      checked.push(monster)
    } else {
      monster.isChecked = false
      monster.isStarting = false
    }

    if (monster.isMVP) mvp.push(monster)
    else mini.push(monster)
  })
  
  return { timers, leftList, tabItems: { mvp, mini, checked } }
}

const reducer = (prevState, nextState) => {
  const message = assignValue("message", prevState, nextState, null)

  if ("timers" in nextState || "leftList" in nextState) {
    const timers = assignValue("timers", prevState, nextState, [])
    const leftList = assignValue("leftList", prevState, nextState, [])
    return { ...buildItems({ timers, leftList }), message }
  } else {
    return { ...prevState, message }
  }
}

function CheckDrawer({ intl, isOpen, monsters, timers, onClose }) {
  const [state, setState] = useReducer(reducer
    , { timers, leftList: monsters }, buildItems)
  const tempTimers = useRef(timers)

  const changeList = useRef((monster, isAdd) => {
    let newList = tempTimers.current
    if (isAdd)
      newList.push(TimerObj(monster))
    else
      newList = newList.filter(item => item.id != monster.id)

    tempTimers.current = newList
    setState({ 
      timers: newList,
      message: template(intl.timer.checkMsg, newList.length, monsters.length)
    })
  })

  const searchPanel = useRef(<SearchPanel
    source     = { monsters }
    fields     = { searchFields }
    placeholder= { intl.timer.search }
    onSearch   = { resultList => setState({ leftList: resultList }) }
  />)

  useEffect(() => {
    if (isChanged(timers, state.timers)) {
      tempTimers.current = timers
      setState({ timers })
    }
  }, [timers])

  const handleClose = () => {
    onClose(state.timers.sort((a, b) => a.id - b.id))
    setState({ timers: [], message: null })
  }
  
  return (
    <DrawerContainer
      className = "check-drawer"
      intl      = { intl }
      keep      = { true }
      anchor    = "bottom"
      isOpen    = { isOpen }
      onClose   = { () => handleClose() }
      header    = { searchPanel.current }
    >
      <CheckTabs
        intl     = { intl }
        items    = { state.tabItems }
        onCheck  = { changeList.current } 
      />

      <Snackbar
        className       = "check-message"
        anchorOrigin    = { { vertical: "bottom", horizontal: "center" } }
        open            = { !!state.message }
        key             = { state.message }
        message         = { state.message }
        autoHideDuration= { 3 * SECOND }
        onClose         = { () => setState({ message: null }) }
      />
    </DrawerContainer>
  )
}

export default memo(CheckDrawer, skipEvents)