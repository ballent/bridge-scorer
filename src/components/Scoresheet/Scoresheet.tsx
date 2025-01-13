import { Fragment } from 'react/jsx-runtime'
import './Scoresheet.css'
import { IBidScore } from '../../utils/Rubber/Rubber.types'
import Score from './Score/Score'

interface ScoresheetProps {
  scoresAbove: { teamWe: IBidScore[]; teamThey: IBidScore[] }
  scoresBelow: { teamWe: IBidScore[][]; teamThey: IBidScore[][] }
  scoreIdHovering: number | null
  setScoreIdHovering: (id: number | null) => void
}

const Scoresheet: React.FC<ScoresheetProps> = ({
  scoresAbove,
  scoresBelow,
  scoreIdHovering,
  setScoreIdHovering
}) => {
  return (
    <div className="scoresheet-container">
      <table>
        <thead>
          <tr>
            <th>We</th>
            <th>They</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="break" colSpan={2}></td>
          </tr>
          <tr>
            <td className="score-above">
              {[...scoresAbove.teamWe].reverse().map((bid, i) => {
                return (
                  <Score
                    key={'we-above-' + i}
                    bidScore={bid}
                    showHighlight={scoreIdHovering === bid.id}
                    setScoreIdHovering={setScoreIdHovering}
                  />
                )
              })}
            </td>
            <td className="score-above">
              {[...scoresAbove.teamThey].reverse().map((bid, i) => {
                return (
                  <Score
                    key={'they-above-' + i}
                    bidScore={bid}
                    showHighlight={scoreIdHovering === bid.id}
                    setScoreIdHovering={setScoreIdHovering}
                  />
                )
              })}
            </td>
          </tr>
          {scoresBelow.teamWe.map((_game, i) => {
            return (
              <Fragment key={i}>
                <tr>
                  <td className="break" colSpan={2}></td>
                </tr>
                <tr>
                  <td className="score-below">
                    {scoresBelow.teamWe[i].map((bid, j) => {
                      return (
                        <Score
                          key={'we-' + i + j}
                          bidScore={bid}
                          showHighlight={scoreIdHovering === bid.id}
                          setScoreIdHovering={setScoreIdHovering}
                        />
                      )
                    })}
                  </td>
                  <td className="score-below">
                    {scoresBelow.teamThey[i].map((bid, j) => {
                      return (
                        <Score
                          key={'they-' + i + j}
                          bidScore={bid}
                          showHighlight={scoreIdHovering === bid.id}
                          setScoreIdHovering={setScoreIdHovering}
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
