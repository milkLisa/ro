import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { SECOND, getFormatedTime } from '../../constants/date_time';

export default class MonsterCard extends Component {
  state = {
    isStart: false,
    time: this.props.monster.msec
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
    this.timer = setInterval(() => this.forward(), SECOND);
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
      <Card className={`monster-card${isStart ? " timer": ""}`}>
        <Box className="avatar">
          <CardContent>
            <CardMedia
              component="img"
              image={`/static/images/${img}`}
              alt={monster.name}
            />
          </CardContent>
          <CardContent>
            <Box className="level">
              <Typography component="div">{monster.isMVP? "MVP": "Boss"}</Typography>
              <Typography component="div">{`Lv.${monster.level}`}</Typography>
            </Box>
            <Box className="status">
              <Typography component="div">{monster.race}</Typography>
              <Typography component="div">{monster.element}</Typography>
              <Typography component="div">{monster.size}</Typography>
            </Box>
          </CardContent>
        </Box>
        <Box className="info">
          <CardContent className="label">
            <Typography component="div" className="name">
              {monster.name}
            </Typography>
            <Typography component="div" className="location">
              { monster.location }
            </Typography>
          </CardContent>
          <Box className="time">
            <Typography component="div" className={isStart? "timer": ""}>
              { getFormatedTime(time) }
            </Typography>
            <Typography component="div" className="play">
              <IconButton 
                aria-label="rewind"
                onClick={() => this.rewind()}
              >
                <SkipPreviousIcon />
              </IconButton>
              <IconButton 
                aria-label="start/stop"
                onClick={() => isStart ?this.stop(): this.start()}
              >
                { isStart ? <StopCircleIcon /> : <PlayArrowIcon /> }
              </IconButton>
              <IconButton 
                aria-label="forward"
                onClick={() => this.forward()}
              >
                <SkipNextIcon />
              </IconButton>
            </Typography>
          </Box>
        </Box>
      </Card>
    )
  }
}