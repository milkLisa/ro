import { useState, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ScrollTopButton from './ScrollTopButton'
import LoadingModal from './LoadingModal'

export default function DrawerContainer({ 
  intl, className, keep, anchor, isOpen, header, onClose, children,
  closeIcon = <ArrowBackIosNewIcon />
}) {
  const [isLoading, setIsLoading] = useState(false)
  const container = useRef(null)

  useEffect(() => {
    if (isLoading) setIsLoading(false)
  }, [isOpen])

  const handleClose = () => {
    if (isOpen) {
      setIsLoading(true)
      onClose()
    }
  }

  return (
    <>
      {
        isLoading && <LoadingModal message={ intl.home.loading } />
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
            <div className="button-box">
              <IconButton
                aria-label = "close"
                className  = "close-btn"
                onClick    = { () => handleClose() }
              >
                { closeIcon }
              </IconButton>
            </div>

            { header }
          </header>

          { children }

          <ScrollTopButton scrollWin={ container } />
        </Container>
      </Drawer>
    </>
  )
}