import { memo } from 'react'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'

function ToggleSwitch({ name, status, onSwitch }) {
  return (
    <div 
      className = "toggle-switch"
      onClick   = { () => onSwitch(name, !status) }
    >
      {
        status
          ? <ToggleOnIcon className="on" />
          : <ToggleOffIcon className="off" />
      }
    </div>
  )
}

export default memo(ToggleSwitch)