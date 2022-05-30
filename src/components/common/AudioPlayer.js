import { useState, useEffect } from "react"
import { isValid } from "../../utils/parser"

export default function AudioPlayer({ id, src, seconds = null, onFinish }) {
  let playId = null

  useEffect(() => {
    function reset() {
      onFinish(id)
      clearInterval(playId)
      playId = null
    }

    if (seconds) {
      clearInterval(playId)
      playId = setInterval(() => reset(), seconds)
    }

    return () => clearInterval(playId)
  }, [id])

  return (
    <>
      {
        isValid(src) && isValid(id) && (
          seconds 
            ? <audio autoPlay loop src={ src } />
            : <audio autoPlay src={ src } />
        )
      }
    </>
  )
}