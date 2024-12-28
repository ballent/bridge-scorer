import { useState } from 'react'
import { IBidScore, IContractBid } from '../../../utils/Rubber/Rubber.types'
import BidModal from '../../BidModal/BidModal'
import ScoreMenu from '../ScoreMenu/ScoreMenu'
import './Score.css'
import Info from '../../../assets/Info'

interface ScoreProps {
  bid: IBidScore
  showHighlight: boolean
  setScoreIdHovering: (bidId: number | null) => void
  onDeleteBid: (bidId: number) => void
  onEditBid: (bid: IContractBid, bidId?: number) => void
}

const Score = ({ bid, showHighlight, setScoreIdHovering, onDeleteBid, onEditBid }: ScoreProps) => {
  const [isHoveringScore, setIsHoveringScore] = useState(false)
  const [scoreMenuVisible, setScoreMenuVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  const handlePress = () => {
    setScoreMenuVisible(!scoreMenuVisible)
    setIsHoveringScore(false)
  }

  const handleMouseEnter = () => {
    setScoreIdHovering(bid.id)
    setIsHoveringScore(true)
  }

  const handleMouseLeave = () => {
    setScoreIdHovering(null)
    setIsHoveringScore(false)
  }

  const handleDeleteBid = (id: number) => {
    setScoreMenuVisible(false)
    onDeleteBid(id)
  }

  return (
    <>
      <div
        className="score-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={`score ${showHighlight ? 'bold' : null}`}>{bid.score}</span>
        {isHoveringScore && !scoreMenuVisible && (
          <button className="score-ellipse" onClick={handlePress}>
            <Info size={14} />
          </button>
        )}
        {scoreMenuVisible && (
          <ScoreMenu
            bid={bid}
            setIsVisible={setScoreMenuVisible}
            handleDeleteBid={handleDeleteBid}
            setIsEditModalVisible={setIsEditModalVisible}
          />
        )}
        <BidModal
          title='Edit bid'
          bidId={bid.id}
          isVisible={isEditModalVisible}
          setIsVisible={setIsEditModalVisible}
          onSubmitBid={onEditBid}
        />
      </div>
    </>
  )
}

export default Score
