var settings = [{
  id: 0,  //For idb store
  showName: true, 
  showLocation: true, 
  showDateTime: true,
  remindBefore: 5,  //Minutes
  continueAfter: 1,  //Minutes
  remindAudio: "default1.mp3",
  playSeconds: 5
}]

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(settings)
  } else if (req.method === "PATCH") {
    settings[0] = req.body
    res.status(200).json(settings)
  } else {
    res.status(400).json([])
  }
}