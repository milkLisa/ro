import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'

export default function ToggleSwitch({ status, onSwitch }) {
  return (
    <div 
      className = "toggle-switch"
      onClick   = { () => onSwitch(!status) }
    >
      {
        status
          ? <ToggleOnIcon className="on" />
          : <ToggleOffIcon className="off" />
      }
    </div>
  )
}