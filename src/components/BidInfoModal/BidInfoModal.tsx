import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Close from '../../assets/close.svg'
import Bid from '../../utils/Bid'
import './BidInfoModal.css'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import BidInput from '../BidInput/BidInput'

interface BidModalProps {
  title: string | ReactNode
  isVisible: boolean
  bid: Bid
  showMath: boolean
  setShowMath: (isVisible: boolean) => void
  setIsVisible: (isVisible: boolean) => void
  onEditBid: (bid: IContractBid, bidId?: number) => void
}

const BidInfoModal: React.FC<BidModalProps> = ({ title, bid, isVisible, showMath, setIsVisible, onEditBid }) => {
  const contractBid = bid.contractBid

  const handleCloseModal = () => {
    setIsVisible(false)
  }

  const handleEditBid = (editedBid: IContractBid) => {
    onEditBid(editedBid, bid.id)
    setIsVisible(false)
  }

  return (
    <>
      {isVisible &&
        createPortal(
          <>
            <div onClick={handleCloseModal} className="backdrop" />
            <div className="modal">
              <div className="header">
                <span className='modal-title'>{title}</span>
                <button className="close" onClick={handleCloseModal}>
                  <img src={Close} alt="Close" />
                </button>
              </div>
              {showMath && (
                <span>{bid.pointsPerTrick}</span>
              )}
              <BidInput defaultBid={contractBid} submitText={'Save and close'} onSubmit={handleEditBid} />
            </div>
          </>,
          document.body
        )}
    </>
  )
}

export default BidInfoModal
