import { Component } from 'react'
import IconButton from '@mui/material/IconButton'
import Replay10Icon from '@mui/icons-material/Replay10'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import Forward10Icon from '@mui/icons-material/Forward10'
import { DAY, SECOND, getFormatedTime } from '../../constants/dateTime'

export default class TimerCard extends Component {
  state = {
    isStart : false,
    time    : this.props.monster.msec
  }

  componentWillUnmount() {
    this.stop()
  }

  rewind() {
    const { time } = this.state
    this.setState({ time: time + 10 * SECOND })
  }

  forward() {
    const { time } = this.state
    console.log(time, time - 10 * SECOND)
    this.setState({ time: time - 10 * SECOND })
  }

  timing() {
    const { time } = this.state
    time < -DAY ? this.stop() : this.setState({ time: time - SECOND })
  }

  start() {
    this.timer = setInterval(() => this.timing(), SECOND)
    this.setState({ isStart: true })
  }

  stop() {
    clearInterval(this.timer)
    this.setState({ isStart: false, time: this.props.monster.msec })
  }

  render() {
    const { monster } = this.props
    const { isStart, time } = this.state
    const img = monster.image ? monster.image : "egg.png"
    
    return (
      <div className={ `timer-card${ isStart ? " timer": "" }` }>
        <div className="avatar">
          <div>
            <img
              src = { `/static/images/${ img }` }
              alt = { monster.name }
            />
          </div>
          
          <div>
            <div className="note">
              <span>{ `ID ${ monster.roId }` }</span>
            </div>

            <div className="desc">
              <span>{ monster.isMVP ? "MVP" : "Boss" }</span>
              <span>{ `Lv.${ monster.level }` }</span>
            </div>

            <div className="note">
              <span>{ monster.race }</span>
              <span>{ monster.element }</span>
              <span>{ monster.size }</span>
            </div>
          </div>
        </div>
        
        <div className="info">
          <div className={ `name${ isStart? " timer": "" }` }>
            <span>{ monster.name }</span>
          </div>
          
          <span className="location">{ monster.location }</span>
          
          <div className="time">
            <div className={ `${ isStart? "timer": "" } ${ time < 0? "appeared": "" }` }>
              { getFormatedTime(time) }
            </div>

            <div className="play">
              <IconButton 
                aria-label  = "rewind"
                onClick     = { () => this.rewind() }
              >
                <Replay10Icon />
              </IconButton>
              <IconButton 
                aria-label  = "start/stop"
                onClick     = { () => isStart ? this.stop(): this.start() }
              >
                { isStart ? <StopCircleIcon /> : <PlayArrowIcon /> }
              </IconButton>
              <IconButton 
                aria-label  = "forward"
                onClick     = { () => this.forward()  }
              >
                <Forward10Icon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}