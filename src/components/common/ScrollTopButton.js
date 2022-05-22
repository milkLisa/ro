import { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

export default function ScrollTopButton({ scrollWin }) {
  const [show, setShow] = useState(false)
  let parent
  
  useEffect(() => {
    let isUnmount = false
    if (scrollWin && scrollWin.current) {
      parent = scrollWin.current
      parent.addEventListener("scroll", e => {
        if (!isUnmount) handleScroll(e.target.scrollTop, e.target.clientHeight)
      })
    } else {
      parent = window
      parent.addEventListener("scroll", () => {
        if (!isUnmount) handleScroll(window.scrollY, window.innerHeight)
      })
    }

    return () => {
      parent.removeEventListener("scroll", handleScroll)
      isUnmount = true
    }
  })

  const handleScroll = (scrollOffset, viewHeight) => {
    if (scrollOffset > (viewHeight / 2)) {
      if (!show) setShow(true)
    } else {
      if (show) setShow(false)
    }
  }

  const handleClick = () => {
    parent["scrollTo"]({ top: 0, behavior: "smooth" })
  }
  
  return (
    <IconButton
      aria-label = "scroll to top"
      className  = { `scroll-btn${ show ? " show": "" }` }
      onClick    = { () => handleClick() }
    >
      <ExpandLessIcon />
    </IconButton>
  )
}