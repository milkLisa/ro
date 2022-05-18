import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Loading from './Loading'

export default function DrawerContainer({ 
  anchor, isOpen, header, onClose, children, 
  closeIcon = <CloseIcon />, closeLabel = "ESC"
}) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(!isOpen)
  }, [isOpen])

  const handleClose = () => {
    setLoading(true)
    onClose()
  }

  return (
    <Drawer
      anchor    = { anchor }
      open      = { isOpen }
      ModalProps= { { keepMounted: true } }
      onClose   = { () => handleClose() }
    >
      <Container className="drawer-container">
        <header>
          { header }

          <div className="buton-box">
            { loading && <Loading size="initail" /> }

            <IconButton
              aria-label = "close"
              className  = "close-btn"
              onClick    = { () => handleClose() }
            >
              { closeIcon }
              
              <span>{ closeLabel }</span>
            </IconButton>
          </div>
        </header>

        { children }
      </Container>
    </Drawer>
  )
}