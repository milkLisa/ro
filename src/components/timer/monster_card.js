import { Component } from 'react'
import IconButton from '@mui/material/IconButton'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { SECOND, getFormatedTime } from '../../constants/date_time'

export default class MonsterCard extends Component {
  state = {
    isStart : false,
    time    : this.props.monster.msec
  }

  componentWillUnmount() {
    this.stop()
  }

  rewind() {
    let { time } = this.state
    time = time + SECOND
    this.setState({ time })
  }

  forward() {
    let { time } = this.state
    time = time - SECOND
    this.setState({ time })
  }

  start() {
    this.timer = setInterval(() => this.forward(), SECOND)
    this.setState({ isStart: true })
    this.forward()
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
      <div className={ `monster-card${ isStart ? " timer": "" }` }>
        <div className="avatar">
          <div>
            <img
              src = { `/static/images/${ img }` }
              alt = { monster.name }
            />
          </div>
          
          <div>
            <div className="level">
              <span>{ monster.isMVP ? "MVP" : "Boss" }</span>
              <span>{ `Lv.${ monster.level }` }</span>
            </div>

            <div className="status">
              <span>{ monster.race }</span>
              <span>{ monster.element }</span>
              <span>{ monster.size }</span>
            </div>
          </div>
        </div>
        
        <div className="info">
          <div className="label">
            <div className="name">
              <span>{ monster.name }</span>
            </div>

            <span className="location">{ monster.location }</span>
          </div>
          
          <div className="time">
            <div className={ isStart? "timer": "" }>
              { getFormatedTime(time) }
            </div>

            <div className="play">
              <IconButton 
                aria-label  = "rewind"
                onClick     = { () => this.rewind() }
              >
                <SkipPreviousIcon />
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
                <SkipNextIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}