import React, { useContext } from 'react'
import { createPortal } from 'react-dom'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import BidInput from '../BidInput/BidInput'
import { RubberContext } from '../BridgeGame/BridgeGame'
import Close from '../../assets/close.svg'

interface BidModalProps {
  title: string
  isVisible: boolean
  bidId?: number
  setIsVisible: (isVisible: boolean) => void
  onSubmitBid: (bid: IContractBid, bidId?: number) => void
}

const BidModal: React.FC<BidModalProps> = ({
  title,
  bidId,
  isVisible,
  setIsVisible,
  onSubmitBid,
}) => {
  const { rubber } = useContext(RubberContext)
  const defaultBid = bidId !== undefined ? rubber.getContractBidById(bidId) : undefined

  const handleCloseModal = () => {
    setIsVisible(false)
  }

  const handleSubmitBid = (bid: IContractBid) => {
    setIsVisible(false)
    onSubmitBid(bid, bidId)
  }

  return (
    <>
      {isVisible &&
        createPortal(
          <>
            <div onClick={handleCloseModal} className='backdrop' />
            <div className="modal-content">
              <div className='header'>
                {title}
                <button className='close' onClick={handleCloseModal}><img src={Close} alt='Close' /></button>
              </div>
              <BidInput defaultBid={defaultBid} submitText={bidId !== undefined ? 'Save' : undefined} onSubmit={handleSubmitBid} />
            </div>
          </>,
          document.body
        )}
    </>
  )
}

export default BidModal
