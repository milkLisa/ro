import CircularProgress from '@mui/material/CircularProgress'

export default function Loading(props) {
  return (
    <CircularProgress 
      disableShrink = { true }
      className     = "progress"
      { ...props }
    />
  )
}