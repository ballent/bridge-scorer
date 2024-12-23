import { IBidScore } from "../../../utils/Rubber/Rubber.types"
import './ScoreMenu.css'

interface ScoreMenuProps {
  bid: IBidScore
  setIsVisible: (isVisible: boolean) => void
  handleDeleteBid: (bidId: number) => void
  setIsEditModalVisible: (isVisible: boolean) => void
}
const ScoreMenu = ({ bid, setIsVisible, handleDeleteBid, setIsEditModalVisible }: ScoreMenuProps) => {

  return (
    <div key={'bid-menu' + bid.id} className="score-menu" onMouseLeave={() => setIsVisible(false)}>
      <button onClick={() => handleDeleteBid(bid.id)}>Delete bid</button>
      <button onClick={() => setIsEditModalVisible(true)}>Edit bid</button>
      <span>{bid.scoreDescription}</span>
    </div>
  )
}

export default ScoreMenu
