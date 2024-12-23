import { useState } from 'react'
import { IBidScore, IContractBid } from '../../../utils/Rubber/Rubber.types'
import EditBidModal from '../../EditBidModal/EditBidModal'
import ScoreMenu from '../ScoreMenu/ScoreMenu'
import './Score.css'

interface ScoreProps {
  bid: IBidScore
  showHighlight: boolean
  setScoreIdHovering: (bidId: number | null) => void
  onDeleteBid: (bidId: number) => void
  onEditBid: (bidId: number, bid: IContractBid) => void
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
            •••
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
        <EditBidModal
          bidId={bid.id}
          isVisible={isEditModalVisible}
          setIsVisible={setIsEditModalVisible}
          onEditBid={onEditBid}
        />
      </div>
    </>
  )
}

export default Score
