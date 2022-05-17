var settings = {}

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(settings)
  } else if (req.method === "PUT") {
    settings = req.body
    res.status(200).json(settings)
  } else {
    res.status(400).json([])
  }
}