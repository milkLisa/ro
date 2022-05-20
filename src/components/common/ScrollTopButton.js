import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import IconButton from '@mui/material/IconButton'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

export default function ScrollTopButton({ scrollWin }) {
  const [show, setShow] = useState(false)
  let parent
  
  useEffect(() => {
    if (scrollWin) {
      parent = ReactDOM.findDOMNode(scrollWin)
      parent.addEventListener("scroll", 
        e => handleScroll(e.target.scrollTop))
    } else {
      parent = window
      parent.addEventListener("scroll",
        () => handleScroll(window.scrollY))
    }

    return () => parent.removeEventListener("scroll", handleScroll)
  })

  const handleScroll = scrollOffset => {
    if (scrollOffset > 250) {
      if (!show) setShow(true)
    } else {
      if (show) setShow(false)
    }
  }

  const handleClick = () => {
    parent["scrollTo"]({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {
        show &&
        <IconButton
          aria-label = "scroll to top"
          className  = "scroll-btn"
          onClick    = { () => handleClick() }
        >
          <ExpandLessIcon />
        </IconButton>
      }
    </>
  )
}