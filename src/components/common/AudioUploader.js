import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

export default function AudioUploader({
  name = "audio", className, uploadList = [], maxLimit = 5, maxMsg = "Max 5", 
  sizeLimit, fileTypes = ["mp3"], placeholder, errorMsg, 
  onUpload, onDelete, onError
}) {
  const handleAudioChange = e => {
    e.preventDefault()

    let reader = new FileReader()
    const file = e.target.files[0]

    if (!file) return

    const fileName = file.name

    if (uploadList.map(a => a.name).includes(fileName)) {
      onError({ type: "exist", name: fileName })
      e.target.value = null
      return
    }

    const extension = fileName.split(".").pop().toLowerCase()

    // fileTypes為空(未指定)，則接受所有格式
    const isAccept = fileTypes.length === 0 || fileTypes.indexOf(extension) > -1
    
    reader.onloadend = async () => {
      if (file.size > sizeLimit) {
        onError({ type: "size", name: fileName, size: file.size })
      } else {
        try {
          let player = new Audio(reader.result)
          player.addEventListener("canplay", () => {
            player.pause()
            player = null
          })
          await player.play()
          onUpload({ name: fileName, src: reader.result })
        } catch (err) {
          onError({ type: "format", name: fileName })
        }
      }

      e.target.value = null
    }
    
    if (isAccept) {
      reader.readAsDataURL(file)
    } else {
      onError({ type: "type", name: fileName })
      e.target.value = null
    }
  }
  
  const acceptTypes = fileTypes.reduce((result, next) => {
    result.push(`.${ next }`)
    return result
  }, [])

  return (
    <div className={ `upload-manager ${ className ? className : "" }` }>
      {
        uploadList.length > 0 &&
        <div className="action-area">
          {
            uploadList.map((audio, index) =>
              <IconButton
                key       = { index }
                className = "delete-btn"
                aria-label= "delete uploadList audio"
                onClick   = { () => onDelete(audio.name) }
              >
                <span>{ audio.name }</span>
                <HighlightOffIcon />
              </IconButton>
            )
          }
        </div>
      }
      
      {
        uploadList.length >= maxLimit
        ? <div className="upload-max">{ maxMsg }</div>
        : <div className="upload-area">
          <input
            id        = { `${name}_uploader` }
            className = "upload-input"
            type      = "file"
            accept    = { acceptTypes }
            onChange  = { handleAudioChange }
          />

          <label
            htmlFor   = { `${name}_uploader` }
            className = "upload-btn"
          >
            <div className="upload-label">
              <CloudUploadIcon className="icon" />
              <span>{ placeholder }</span>
            </div>
          </label>
        </div>
      }

      { errorMsg && <Alert severity="error">{ errorMsg }</Alert> }
    </div>
  )
}