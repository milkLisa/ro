import { useState, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/ExitToApp'
import ScrollTopButton from './ScrollTopButton'
import LoadingModal from './LoadingModal'
import Loading from './Loading'

export default function DrawerContainer({ 
  intl, className, keep, anchor, isOpen, header, onClose, children,
  closeIcon = <CloseIcon />
}) {
  const [loading, setLoading] = useState(false)
  const container = useRef(null)

  useEffect(() => {
    if (loading) setLoading(false)
  }, [isOpen])

  const handleClose = () => {
    if (isOpen) {
      setLoading(true)
      onClose()
    }
  }

  return (
    <>
      {
        loading && <LoadingModal intl={ intl } open={ loading } />
      }

      <Drawer
        className = { className }
        anchor    = { anchor }
        open      = { isOpen }
        PaperProps= { { ref: container } }
        ModalProps= { { keepMounted: !!keep } }
        onClose   = { () => handleClose() }
      >
        <Container className="drawer-container" >
          <header>
            { header }

            <div className="buton-box">
              { loading && <Loading size="50px" /> }

              <IconButton
                aria-label = "close"
                className  = "close-btn"
                onClick    = { () => handleClose() }
              >
                { closeIcon }
              </IconButton>
            </div>
          </header>

          { children }

          <ScrollTopButton scrollWin={ container } />
        </Container>
      </Drawer>
    </>
  )
}