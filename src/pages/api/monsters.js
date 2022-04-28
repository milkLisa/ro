
import { monsters } from '../../constants/monsters'

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(monsters.filter(mon => mon.isMVP))
  } else {
    res.status(400).json([])
  }
}
