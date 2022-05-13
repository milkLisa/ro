import MonsterCard from './MonsterCard'

export default function TimerList({ intl, timers, onChange }) {
  return (
    <div className="list">
      {
        timers.length > 0 
        ? timers.map(mon => (
          <MonsterCard 
            intl    = { intl }
            key     = { `${ mon.id }${ mon.roId }` } 
            monster = { mon }
            onChange= { onChange }
          />
        ))
        : <span>{ intl.timer.checkTimer }</span>
      }
    </div>
  )
}