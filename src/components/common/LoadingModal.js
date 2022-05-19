import Modal from '@mui/material/Modal'
import Loading from './Loading'

export default function LoadingModal({ intl, open }) {
  return (
    <Modal
      open      = { open }
      className = "loading-modal"
      disableAutoFocus
    >
      <div className="content">
        <Loading />
        
        <span>{ intl.home.loading }</span>
      </div>
    </Modal>
  )
}