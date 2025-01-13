import React, { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import Close from '../../assets/close.svg'
import Bid from '../../utils/Bid'
import './BidInfoModal.css'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import BidInput from '../BidInput/BidInput'
import ContractBid from '../ContractBid/ContractBid'
import Trash from '../../assets/Trash'
import Reset from '../../assets/Reset'
import { RubberContext } from '../BridgeGame/BridgeGame'
import Question from '../../assets/Question'

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
  onEditBid
}) => {
  const contractBid = bid.contractBid
  const { rubberHistory, jumpToBid } = useContext(RubberContext)
  const [showMath, setShowMath] = useState(false)

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
    jumpToBid(rubberHistory.map((bid) => bid.contractBid).slice(0, bidId + 1))
    setIsVisible(false)
  }

  const scoreDescriptionBelow = bid.biddingTeamScoreDescription.scoreBelow
  const scoreDescriptionAbove = bid.biddingTeamScoreDescription.scoreAbove
  const nonBiddingTeamScoreDescription = bid.nonBiddingTeamScoreDescription

  return (
    <>
      {isVisible &&
        createPortal(
          <>
            <div onClick={handleCloseModal} className="backdrop" />
            <div className="modal-content">
              <div className="header">
                <span className="modal-title">
                  <div className="title-container">
                    <ContractBid bid={bid.contractBid} style={{ fontWeight: '700' }} />
                    <button className="question" onClick={() => setShowMath(!showMath)}>
                      <Question color="grey" size={34} />
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
              {showMath && (
                <div className="math-container">
                  <span className="input-title">Score</span>
                  <div className="math-content">
                    {scoreDescriptionBelow && (
                      <>
                        Score below:{' '}
                        <span className="score-entry">
                          {bid.biddingTeamScoreDescription.scoreBelow}
                        </span>
                      </>
                    )}
                    {scoreDescriptionAbove && (
                      <>
                        Score above bidding team:{' '}
                        <span className="score-entry">
                          {bid.biddingTeamScoreDescription.scoreAbove}
                        </span>
                      </>
                    )}
                    {nonBiddingTeamScoreDescription && (
                      <>
                        Score above non bidding team:{' '}
                        <span className="score-entry">{bid.nonBiddingTeamScoreDescription}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
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
