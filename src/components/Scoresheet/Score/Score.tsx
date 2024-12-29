import { useContext, useState } from 'react'
import { IBidScore } from '../../../utils/Rubber/Rubber.types'
import './Score.css'
import { RubberContext } from '../../BridgeGame/BridgeGame'

interface ScoreProps {
  bidScore: IBidScore
  showHighlight: boolean
  setScoreIdHovering: (bidId: number | null) => void
}

const Score = ({ bidScore, showHighlight, setScoreIdHovering }: ScoreProps) => {
  const [, setIsHoveringScore] = useState(false)
  const { rubber } = useContext(RubberContext)
  const bid = rubber.getBidById(bidScore.id)

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
      </div>
    </>
  )
}

export default Score
