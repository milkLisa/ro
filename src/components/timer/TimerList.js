import { Component } from 'react'
import { TimerObj } from '../../constants/customData'
import { MINUTE, SECOND, parseToMSEC } from '../../constants/dateTime'
import { isValid, isChanged } from '../../utils/parser'
import MonsterCard from './MonsterCard'
import SortedDrawer from './SortedDrawer'

const sortByAppearTime = list => {
  let newList = list.filter(m => !!m.utcMSEC)
  newList.sort((a, b) => a.utcMSEC - b.utcMSEC)
  return newList
}

export default class TimerList extends Component {
  state = { isSortOpen: false, allTimer: this.props.timers }
  intervalId = null
  
  componentDidMount() {
    const hasTiming = this.state.allTimer.some(mon => isValid(mon.utcMSEC))
    if (hasTiming) this.start()
  }

  componentDidUpdate(prevProps) {
    const { timers } = this.props
    let { allTimer } = this.state

    if (isChanged(timers, prevProps.timers)) {
      let timerMap = allTimer.reduce((previous, current) => {
        previous[current.id] = current
        return previous
      }, {})

      allTimer = timers.map(mon => Object.assign(mon, timerMap[mon.id]))
      this.setState({ allTimer })
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  timing() {
    const { settings } = this.props
    let { allTimer } = this.state
    let keepTiming = false, hasStop = false

    allTimer = allTimer.map(mon => {
      if (isValid(mon.utcMSEC)) {
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

    if (hasStop) this.props.onChange(allTimer.map(m => TimerObj(m)))
    else this.setState({ allTimer })
  }

  clearTimer() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  start(timer) {
    let { allTimer } = this.state
    
    if (!timer) {
      // No assign timer means initial
      this.clearTimer()
    } else {
      allTimer = allTimer.map(mon => {
        if (mon.id == timer.id) mon = Object.assign(mon, timer)
        return mon
      })

      this.props.onChange(allTimer.map(m => TimerObj(m)))
    }

    if (!this.intervalId)
      this.intervalId = setInterval(() => this.timing(), SECOND)
  }

  stop(timer) {
    let { allTimer } = this.state
    let keepTiming = false

    allTimer = allTimer.map(mon => {
      if (mon.id == timer.id) {
        mon = Object.assign(mon, { ...timer, leftTime: null })
      }

      if (isValid(mon.utcMSEC)) keepTiming = true
      return mon
    })

    this.props.onChange(allTimer.map(m => TimerObj(m)))

    if (!keepTiming) this.clearTimer()
  }

  MonsterList(prefix, list) {
    const { intl, settings } = this.props

    return list.map(mon => (
      <MonsterCard 
        intl     = { intl }
        settings = { settings }
        key      = { `${prefix}${ mon.id }${ mon.roId }` }
        monster  = { mon }
        onStart  = { timer => this.start(timer) }
        onStop   = { timer => this.stop(timer) }
      />
    ))
  }

  render() {
    const { intl } = this.props
    const { isSortOpen, allTimer } = this.state
    const sorted = sortByAppearTime(allTimer)

    return (
      <>
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