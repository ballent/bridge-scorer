import { Fragment } from 'react/jsx-runtime'
import './Scoresheet.css'
import { IBidScore, IContractBid } from '../../utils/Rubber/Rubber.types'
import { useState } from 'react'
import EditBidModal from '../EditBidModal/EditBidModal'

interface ScoresheetProps {
  scoresAbove: { teamWe: IBidScore[]; teamThey: IBidScore[] }
  scoresBelow: { teamWe: IBidScore[][]; teamThey: IBidScore[][] }
  onDeleteBid: (id: number) => void
  onEditBid: (bidId: number, bid: IContractBid) => void
}

const Scoresheet: React.FC<ScoresheetProps> = ({
  scoresAbove,
  scoresBelow,
  onDeleteBid,
  onEditBid
}) => {
  const ScoreInfo = ({ bid }: { bid: IBidScore }) => {
    const [isHoveringScore, setIsHoveringScore] = useState(false)
    const [scoreMenuVisible, setScoreMenuVisible] = useState(false)
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)

    const handlePress = () => {
      setScoreMenuVisible(!scoreMenuVisible)
      setIsHoveringScore(false)
    }

    const handleHover = () => {
      setIsHoveringScore(!isHoveringScore)
    }

    const handleDeleteBid = (id: number) => {
      setScoreMenuVisible(false)
      onDeleteBid(id)
    }

    const ScoreMenu = ({ bid }: { bid: IBidScore }) => {

      return (
        <div key={'bid-menu' + bid.id} className="score-menu" onMouseLeave={() => setScoreMenuVisible(false)}>
          <button onClick={() => handleDeleteBid(bid.id)}>Delete bid</button>
          <button onClick={() => setIsEditModalVisible(true)}>Edit bid</button>
          <span>{bid.scoreDescription}</span>
        </div>
      )
    }

    return (
      <>
        <div
          className="score-container"
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          <span className="score">{bid.score}</span>
          {isHoveringScore && !scoreMenuVisible && (
            <button className="score-ellipse" onClick={handlePress}>
              •••
            </button>
          )}
          {scoreMenuVisible && <ScoreMenu bid={bid} />}
          <EditBidModal bidId={bid.id} isVisible={isEditModalVisible} setIsVisible={setIsEditModalVisible} onEditBid={onEditBid} />
        </div>
      </>
    )
  }
  return (
    <table>
      <thead>
        <tr>
          <th>We</th>
          <th>They</th>
        </tr>
      </thead>
      <tbody>
        <tr className="break"></tr>
        <tr>
          <td>
            {[...scoresAbove.teamWe].reverse().map((bid, i) => {
              return <ScoreInfo key={'we-above-' + i} bid={bid} />
            })}
          </td>
          <td>
            {[...scoresAbove.teamThey].reverse().map((bid, i) => {
              return <ScoreInfo key={'they-above-' + i} bid={bid} />
            })}
          </td>
        </tr>
        <tr className="break"></tr>
        {scoresBelow.teamWe.map((_game, i) => {
          return (
            <Fragment key={i}>
              <tr className="break"></tr>
              <tr>
                <td>
                  {scoresBelow.teamWe[i].map((bid, j) => {
                    return <ScoreInfo key={'we-' + i + j} bid={bid} />
                  })}
                </td>
                <td>
                  {scoresBelow.teamThey[i].map((bid, j) => {
                    return <ScoreInfo key={'they-' + i + j} bid={bid} />
                  })}
                </td>
              </tr>
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

export default Scoresheet
