import { Fragment } from 'react/jsx-runtime'
import './Scoresheet.css'
import { IBidScore } from '../../utils/Rubber/Rubber.types'

interface ScoresheetProps {
  scoresAbove: { teamWe: IBidScore[]; teamThey: IBidScore[] }
  scoresBelow: { teamWe: IBidScore[][]; teamThey: IBidScore[][] }
}

const ScoreInfo = ({ bid }: { bid: IBidScore }) => {
  const handlePress = () => {
    console.log(bid.scoreDescription)
  }
  return <button onClick={handlePress}>{bid.score}</button>
}

const Scoresheet: React.FC<ScoresheetProps> = ({
  scoresAbove,
  scoresBelow
}) => {
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
