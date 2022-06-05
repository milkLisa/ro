import { useEffect } from "react"
import { isValid } from "../../utils/parser"

export default function AudioPlayer({ 
  remindId, audioName, seconds = null, source = [], onFinish
}) {
  let playId = null
  const file = source && source.find(a => a.name === audioName)
  const src = file ? file.src : null

  useEffect(() => {
    function reset() {
      onFinish(remindId)
      clearInterval(playId)
      playId = null
    }

    if (isValid(src) && isValid(remindId) && seconds) {
      clearInterval(playId)
      playId = setInterval(() => reset(), seconds)
    }

    return () => clearInterval(playId)
  }, [remindId])

  return (
    <>
      {
        isValid(src) && isValid(remindId) && (
          seconds
            ? <audio autoPlay loop src={ src } />
            : <audio autoPlay src={ src } />
        )
      }
    </>
  )
}