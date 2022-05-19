import CircularProgress from '@mui/material/CircularProgress'

export default function Loading({ size = "60px" }) {
  return (
    <CircularProgress 
      disableShrink = { true }
      className     = "progress"
      size          = { size }
    />
  )
}