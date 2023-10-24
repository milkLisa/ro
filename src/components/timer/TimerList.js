import { Component } from 'react'
import { MINUTE, SECOND, parseToMSEC } from '../../constants/dateTime'
import * as gtag from '../../lib/gtag'
import { isChanged } from '../../utils/parser'
import AudioPlayer from './AudioPlayer'
import MonsterCard from './MonsterCard'
import SortedDrawer from './SortedDrawer'

const sortByAppearTime = list => {
  let newList = list.filter(m => !!m.utcMSEC)
  newList.sort((a, b) => a.utcMSEC - b.utcMSEC)
  return newList
}

export default class TimerList extends Component {
  state = { isSortOpen: false, allTimer: this.props.selectedTimers }
  intervalId = null
  remindId = null
  
  componentDidMount() {
    this.intervalId = setInterval(() => this.timing(), SECOND)
  }

  componentDidUpdate() {
    const { selectedTimers } = this.props
    const { allTimer } = this.state

    if (isChanged(selectedTimers.map(t => t.id), allTimer.map(t => t.id))) {
      let timerMap = allTimer.reduce((previous, current) => {
        previous[current.id] = current
        return previous
      }, {})

      this.setState({ 
        allTimer: selectedTimers.map(monster => Object.assign(monster, timerMap[monster.id]))
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  timing() {
    const { settings } = this.props
    const { allTimer } = this.state
    let hasTiming = false, hasStop = false

    let newAllTimer = allTimer.map(monster => {
      if (!!monster.utcMSEC) {
        const msec = monster.utcMSEC - Date.now()
        if (msec <= (-parseToMSEC(settings.continueAfter) || -MINUTE)) {
          monster.utcMSEC = null
          monster.leftTime = null
          hasStop = true
        } else {
          monster.leftTime = msec
          hasTiming = true
        }
      }

      return monster
    })

    if (hasStop) this.props.onChange(newAllTimer)
    else if (hasTiming) this.setState({ allTimer: newAllTimer })
  }

  handleSwitch(turnOn, timer) {
    if (!turnOn && this.remindId == timer.id) this.remindId = null

    const { allTimer } = this.state
    let newAllTimer = allTimer.map(monster => monster.id == timer.id ? timer : monster)
    this.setState({ allTimer: newAllTimer })
    this.props.onChange(newAllTimer)
  }

  handlePlayerFinish(id) {
    if (this.remindId == id) this.remindId = null
  }

  handleSortOpen(isSortOpen) {
    this.setState({ isSortOpen })

    gtag.event("Check Sorted List", "Sorted Drawer", isSortOpen ? "Open" : "Close")
  }

  MonsterList(prefix, list) {
    const { intl, settings } = this.props

    return list.map(monster => (
      <MonsterCard 
        intl     = { intl }
        settings = { settings }
        key      = { `${ prefix }${ monster.id }` }
        monster  = { monster }
        onSwitch = { (turnOn, timer) => this.handleSwitch(turnOn, timer) }
        onTime   = { id => this.remindId = id }
      />
    ))
  }

  render() {
    const { intl, settings, audios } = this.props
    const { remindAudio, playSeconds } = settings
    const { isSortOpen, allTimer } = this.state
    const sorted = sortByAppearTime(allTimer)
    const file = audios && audios.find(a => a.name === remindAudio)
    const src = file ? file.src : null

    return (
      <>
        <AudioPlayer 
          intl     = { intl }
          remindId = { this.remindId }
          src      = { src }
          delay    = { playSeconds * SECOND }
          onFinish = { id => this.handlePlayerFinish(id) }
        />

        <div className="list">
          { allTimer.length > 0 && this.MonsterList("t", allTimer) }
        </div>

        <SortedDrawer 
          intl   = { intl }
          isOpen = { isSortOpen }
          number = { sorted.length }
          onOpen = { () => this.handleSortOpen(!isSortOpen) }
        >
          { sorted.length > 0 && this.MonsterList("s", sorted) }
        </SortedDrawer>
      </>
    )
  }
}