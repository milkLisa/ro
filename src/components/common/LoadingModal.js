import Modal from '@mui/material/Modal'

export default function LoadingModal({ message }) {
  return (
    <Modal
      open      = { true }
      className = "loading-modal"
      disableAutoFocus
    >
      <div className="content">
        <div className="progress"/>
        
        <span>{ message }</span>
      </div>
    </Modal>
  )
}