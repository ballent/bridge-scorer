import React, { useContext } from 'react'
import { createPortal } from 'react-dom'
import Close from '../../assets/close.svg'
import Bid from '../../utils/Bid'
import './BidInfoModal.css'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import BidInput from '../BidInput/BidInput'
import ContractBid from '../ContractBid/ContractBid'
import Info from '../../assets/Info'
import Trash from '../../assets/Trash'
import Reset from '../../assets/Reset'
import { RubberContext } from '../BridgeGame/BridgeGame'

interface BidModalProps {
  isVisible: boolean
  bid: Bid
  setIsVisible: (isVisible: boolean) => void
  onDeleteBid: (bidId: number) => void
  onEditBid: (bid: IContractBid, bidId?: number) => void
}

const BidInfoModal: React.FC<BidModalProps> = ({
  bid,
  isVisible,
  setIsVisible,
  onDeleteBid,
  onEditBid,
}) => {
  const contractBid = bid.contractBid
  const { rubberHistory, jumpToBid } = useContext(RubberContext)

  const handleCloseModal = () => {
    setIsVisible(false)
  }

  const handleEditBid = (editedBid: IContractBid) => {
    onEditBid(editedBid, bid.id)
    setIsVisible(false)
  }

  const handleDeleteBid = (bidId: number) => {
    onDeleteBid(bidId)
    setIsVisible(false)
  }

  const handleJumpTo = (bidId: number) => {
    jumpToBid(rubberHistory.map(bid => bid.contractBid).slice(0, bidId + 1))
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
                <span className="modal-title">
                  <div className="title-container">
                    <ContractBid bid={bid.contractBid} style={{ fontWeight: '700' }} />
                    <button className="info" onClick={() => handleDeleteBid(bid.id)}>
                      <Info color="grey" size={24} />
                    </button>
                    <button className="trash" onClick={() => handleDeleteBid(bid.id)}>
                      <Trash color="white" size={24} />
                    </button>
                    <button className="reset" onClick={() => handleJumpTo(bid.id)}>
                      <Reset color="white" size={24} />
                    </button>
                  </div>
                </span>
                <button className="close" onClick={handleCloseModal}>
                  <img src={Close} alt="Close" />
                </button>
              </div>
              {false && <span>{bid.pointsPerTrick}</span>}
              <BidInput
                defaultBid={contractBid}
                submitText={'Save and close'}
                onSubmit={handleEditBid}
              />
            </div>
          </>,
          document.body
        )}
    </>
  )
}

export default BidInfoModal
