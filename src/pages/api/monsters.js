
import { monsters } from '../../constants/monsters'

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(monsters)
  } else {
    res.status(400).json(null)
  }
}
