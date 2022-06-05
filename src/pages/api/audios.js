import { API_AUDIOS_BODY_SIZE } from '../../constants/limit'

var audios = [
  { isDefault: true, name: "default1.mp3", src: "/static/audio/default1.mp3" },
  { isDefault: true, name: "default2.mp3", src: "/static/audio/default2.mp3" }
]

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(audios)
  } else if (req.method === "PUT") {
    audios = req.body
    res.status(200).json(audios)
  } else {
    res.status(400).json([])
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: API_AUDIOS_BODY_SIZE,
      responseLimit: API_AUDIOS_BODY_SIZE
    }
  }
}