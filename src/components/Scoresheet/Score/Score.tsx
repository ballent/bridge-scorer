import { useContext, useState } from 'react'
import { IBidScore, IContractBid } from '../../../utils/Rubber/Rubber.types'
import './Score.css'
import Info from '../../../assets/Info'
import BidInfoModal from '../../BidInfoModal/BidInfoModal'
import { RubberContext } from '../../BridgeGame/BridgeGame'

interface ScoreProps {
  bidScore: IBidScore
  showHighlight: boolean
  setScoreIdHovering: (bidId: number | null) => void
  onDeleteBid: (bidId: number) => void
  onEditBid: (bid: IContractBid, bidId?: number) => void
}

const Score = ({ bidScore, showHighlight, setScoreIdHovering, onDeleteBid, onEditBid }: ScoreProps) => {
  const [isHoveringScore, setIsHoveringScore] = useState(false)
  const [bidInfoModalVisible, setBidInfoModalVisible] = useState(false)
  const { rubber } = useContext(RubberContext)
  const bid = rubber.getBidById(bidScore.id)

  const handleClick = () => {
    setBidInfoModalVisible(true)
  }

  const handleMouseEnter = () => {
    bid && setScoreIdHovering(bid.id)
    setIsHoveringScore(true)
  }

  const handleMouseLeave = () => {
    setScoreIdHovering(null)
    setIsHoveringScore(false)
  }

  return (
    <>
      <div
        className="score-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={`score ${showHighlight ? 'bold' : null}`}>{bidScore.score}</span>
        {isHoveringScore && bid && (
          <button className="score-ellipse" onClick={handleClick}>
            <Info size={14} />
          </button>
        )}
        {bid && (
          <BidInfoModal
            isVisible={bidInfoModalVisible}
            bid={bid}
            setIsVisible={setBidInfoModalVisible}
            onDeleteBid={onDeleteBid}
            onEditBid={onEditBid}
          />
        )}
      </div>
    </>
  )
}

export default Score
