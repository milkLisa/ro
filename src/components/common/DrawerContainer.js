import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export default function DrawerContainer({ 
  anchor, isOpen, header, onClose, children, 
  closeIcon = <CloseIcon />, 
  closeLabel = "ESC"
}) {

  const CloseButton = () => {
    return (
      <IconButton
        aria-label = "close"
        className  = "close-btn"
        onClick    = { () => onClose() }
      >
        { closeIcon }
        <span>{ closeLabel }</span>
      </IconButton>)
  }

  return (
    <Drawer
      anchor  = { anchor }
      open    = { isOpen }
      onClose = { () => onClose() }
    >
      <Container className="drawer-container">
        <header>
          { header }

          { CloseButton() }
        </header>

        { children }
      </Container>
    </Drawer>
  )
}