import { createPortal } from 'react-dom'
import Close from '../../assets/close.svg'
import './ConfirmationModal.css'

interface ConfirmationModalProps {
  title: string
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  onConfirm: () => void
}

const ConfirmationModal = ({
  title,
  isVisible,
  setIsVisible,
  onConfirm
}: ConfirmationModalProps) => {
  const handleCloseModal = () => {
    setIsVisible(false)
  }

  const handleConfirm = () => {
    setIsVisible(false)
    onConfirm()
  }

  return (
    <>
      {isVisible &&
        createPortal(
          <>
            <div onClick={handleCloseModal} className="backdrop" />
            <div className="modal-content">
              <div className="header">
                {title}
                <button className="close" onClick={handleCloseModal}>
                  <img src={Close} alt="Close" />
                </button>
              </div>
              <div className="button-container">
                <button className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="confirm-button" onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}

export default ConfirmationModal
