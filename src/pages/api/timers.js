var timers = []

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(timers)
  } else if (req.method === "POST") {
    res.status(200).json(timers)
  } else if (req.method === "PUT") {
    timers = req.body
    res.status(200).json(timers)
  } else if (req.method === "PATCH") {
    timers = timers.map(t => t.id == req.body.id ? req.body : t)
    res.status(200).json(timers)
  } else {
    res.status(400).json([])
  }
}