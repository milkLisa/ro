import { Component } from 'react'
import { MINUTE, SECOND, parseToMSEC } from '../../constants/dateTime'
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
    const hasTiming = this.state.allTimer.some(mon => !!mon.utcMSEC)
    if (hasTiming) this.start()
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
    let keepTiming = false, hasStop = false

    allTimer = allTimer.map(mon => {
      if (!!mon.utcMSEC) {
        const msec = mon.utcMSEC - Date.now()
        if (msec <= (-parseToMSEC(settings.continueAfter) || -MINUTE)) {
          mon.utcMSEC = null
          mon.leftTime = null
          hasStop = true
        } else {
          mon.leftTime = msec
          keepTiming = true
        }
      }

      return mon
    })

    if (!keepTiming) this.clearTimer()

    if (hasStop) this.props.onChange(allTimer)
    else this.setState({ allTimer })
  }

  clearTimer() {
    clearInterval(this.intervalId)
    this.intervalId = null
    this.remindId = null
  }

  start(timer) {
    let { allTimer } = this.state
    
    if (!timer) {
      // No assign timer means initial
      this.clearTimer()
    } else {
      allTimer = allTimer.map(mon => mon.id == timer.id ? timer : mon)
      this.setState({ allTimer })
      this.props.onChange(allTimer)
    }

    if (!this.intervalId)
      this.intervalId = setInterval(() => this.timing(), SECOND)
  }

  stop(timer) {
    let { allTimer } = this.state
    
    if (this.remindId == timer.id) this.remindId = null

    allTimer = allTimer.map(
      mon => mon.id == timer.id ? { ...timer, leftTime: null } : mon
    )

    this.setState({ allTimer })
    this.props.onChange(allTimer)
  }

  handlePlayerFinish(id) {
    if (this.remindId == id) this.remindId = null
  }

  MonsterList(prefix, list) {
    const { intl, settings } = this.props

    return list.map(mon => (
      <MonsterCard 
        intl     = { intl }
        settings = { settings }
        key      = { `${ prefix }${ mon.id }${ mon.roId }` }
        monster  = { mon }
        onStart  = { timer => this.start(timer) }
        onStop   = { timer => this.stop(timer) }
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
          onOpen = { () => this.setState({ isSortOpen: !isSortOpen }) }
        >
          { sorted.length > 0 && this.MonsterList("s", sorted) }
        </SortedDrawer>
      </>
    )
  }
}