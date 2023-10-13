import { useState, memo } from 'react'
import HelpIcon from '@mui/icons-material/Help'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { SECOND } from '../../constants/dateTime'
import { toClassStr } from '../../utils/parser'

function TooltipButton({
  className, position = "bottom", tip = "", delay = SECOND, children
}) {
  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <ClickAwayListener onClickAway={ handleTooltipClose }>
      <Tooltip
        className = { toClassStr("tooltip-btn", className) }
        open      = { open }
        title     = { tip }
        placement = { position }
        leaveDelay= { delay }
        onClick   = { handleTooltipOpen }
        onClose   = { handleTooltipClose }
        arrow
      >
        {
        children
          ? children
          : <IconButton 
              aria-label="helper"
              disableRipple
            >
              <HelpIcon />
            </IconButton>
        }
      </Tooltip>
    </ClickAwayListener>
  )
}

export default memo(TooltipButton)