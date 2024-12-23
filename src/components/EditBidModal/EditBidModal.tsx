import React, { useContext } from 'react'
import { createPortal } from 'react-dom'
import './EditBidModal.css'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import BidInput from '../BidInput/BidInput'
import { RubberContext } from '../BridgeGame/BridgeGame'

interface EditBidModalProps {
  bidId: number
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  onEditBid: (bidId: number, bid: IContractBid) => void
}

const EditBidModal: React.FC<EditBidModalProps> = ({
  bidId,
  isVisible,
  setIsVisible,
  onEditBid
}) => {
  const rubber = useContext(RubberContext)
  const handleCloseModal = () => {
    setIsVisible(false)
  }

  const handleEditBid = (bid: IContractBid) => {
    onEditBid(bidId, bid)
  }

  return (
    <>
      {isVisible &&
        createPortal(
          <div className="modal">
            <BidInput defaultBid={rubber.getContractBidById(bidId)} onSubmit={handleEditBid} />
            <button onClick={handleCloseModal}>Close</button>
          </div>,
          document.body
        )}
    </>
  )
}

export default EditBidModal
