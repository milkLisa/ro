import { Component } from 'react'
import { MINUTE, SECOND, parseToMSEC } from '../../constants/dateTime'
import * as gtag from '../../lib/gtag'
import { isChanged } from '../../utils/parser'
import AudioPlayer from '../common/AudioPlayer'
import MonsterCard from './MonsterCard'
import SortedDrawer from './SortedDrawer'

const sortByAppearTime = list => {
  let newList = list.filter(m => !!m.utcMSEC)
  newList.sort((a, b) => a.utcMSEC - b.utcMSEC)
  return newList
}

export default class TimerList extends Component {
  state = { isSortOpen: false, allTimer: this.props.monTimers }
  intervalId = null
  remindId = null
  
  componentDidMount() {
    this.intervalId = setInterval(() => this.timing(), SECOND)
  }

  componentDidUpdate(prevProps) {
    const { monTimers, settings } = this.props
    let { allTimer } = this.state

    if (isChanged(monTimers.map(t => t.id), allTimer.map(t => t.id))) {
      let timerMap = allTimer.reduce((previous, current) => {
        previous[current.id] = current
        return previous
      }, {})

      allTimer = monTimers.map(mon => Object.assign(mon, timerMap[mon.id]))
      this.setState({ allTimer })
    }

    if (isChanged(settings, prevProps.settings)) this.remindId = null
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  timing() {
    const { settings } = this.props
    let { allTimer } = this.state
    let hasTiming = false, hasStop = false

    allTimer = allTimer.map(mon => {
      if (!!mon.utcMSEC) {
        const msec = mon.utcMSEC - Date.now()
        if (msec <= (-parseToMSEC(settings.continueAfter) || -MINUTE)) {
          mon.utcMSEC = null
          mon.leftTime = null
          hasStop = true
        } else {
          mon.leftTime = msec
          hasTiming = true
        }
      }

      return mon
    })

    if (hasStop) this.props.onChange(allTimer)
    else if (hasTiming) this.setState({ allTimer })
  }

  handleSwitch(turnOn, timer) {
    if (!turnOn && this.remindId == timer.id) this.remindId = null

    let { allTimer } = this.state
    allTimer = allTimer.map(mon => mon.id == timer.id ? timer : mon)
    this.setState({ allTimer })
    this.props.onChange(allTimer)
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

    return list.map(mon => (
      <MonsterCard 
        intl     = { intl }
        settings = { settings }
        key      = { `${ prefix }${ mon.id }${ mon.roId }` }
        monster  = { mon }
        onSwitch = { (turnOn, timer) => this.handleSwitch(turnOn, timer) }
        onTime   = { id => this.remindId = id }
      />
    ))
  }

  render() {
    const { intl, settings } = this.props
    const { isSortOpen, allTimer } = this.state
    const sorted = sortByAppearTime(allTimer)

    return (
      <>
        <AudioPlayer 
          id      = { this.remindId }
          src     = { settings.remindAudio }
          seconds = { settings.playSeconds * SECOND }
          onFinish= { id => this.handlePlayerFinish(id) }
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