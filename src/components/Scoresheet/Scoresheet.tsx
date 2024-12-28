import { Fragment } from 'react/jsx-runtime'
import './Scoresheet.css'
import { IBidScore, IContractBid } from '../../utils/Rubber/Rubber.types'
import Score from './Score/Score'

interface ScoresheetProps {
  scoresAbove: { teamWe: IBidScore[]; teamThey: IBidScore[] }
  scoresBelow: { teamWe: IBidScore[][]; teamThey: IBidScore[][] }
  scoreIdHovering: number | null
  setScoreIdHovering: (id: number | null) => void
  onDeleteBid: (id: number) => void
  onEditBid: (bid: IContractBid, bidId?: number) => void
}

const Scoresheet: React.FC<ScoresheetProps> = ({
  scoresAbove,
  scoresBelow,
  scoreIdHovering,
  setScoreIdHovering,
  onDeleteBid,
  onEditBid
}) => {
  return (
    <div className='scoresheet-container'>
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
            <td className='score-above'>
              {[...scoresAbove.teamWe].reverse().map((bid, i) => {
                return (
                  <Score
                    key={'we-above-' + i}
                    bid={bid}
                    showHighlight={scoreIdHovering === bid.id}
                    setScoreIdHovering={setScoreIdHovering}
                    onDeleteBid={onDeleteBid}
                    onEditBid={onEditBid}
                  />
                )
              })}
            </td>
            <td className='score-above'>
              {[...scoresAbove.teamThey].reverse().map((bid, i) => {
                return (
                  <Score
                    key={'they-above-' + i}
                    bid={bid}
                    showHighlight={scoreIdHovering === bid.id}
                    setScoreIdHovering={setScoreIdHovering}
                    onDeleteBid={onDeleteBid}
                    onEditBid={onEditBid}
                  />
                )
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
                      return (
                        <Score
                          key={'we-' + i + j}
                          bid={bid}
                          showHighlight={scoreIdHovering === bid.id}
                          setScoreIdHovering={setScoreIdHovering}
                          onDeleteBid={onDeleteBid}
                          onEditBid={onEditBid}
                        />
                      )
                    })}
                  </td>
                  <td>
                    {scoresBelow.teamThey[i].map((bid, j) => {
                      return (
                        <Score
                          key={'they-' + i + j}
                          bid={bid}
                          showHighlight={scoreIdHovering === bid.id}
                          setScoreIdHovering={setScoreIdHovering}
                          onDeleteBid={onDeleteBid}
                          onEditBid={onEditBid}
                        />
                      )
                    })}
                  </td>
                </tr>
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Scoresheet
