import { Fragment } from 'react/jsx-runtime';
import './Scoresheet.css'

interface ScoresheetProps {
  scoresAbove: { teamWe: number[]; teamThey: number[] }
  scoresBelow: { teamWe: number[][]; teamThey: number[][] }
}

const Scoresheet: React.FC<ScoresheetProps> = ({
  scoresAbove,
  scoresBelow,
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
            {scoresAbove.teamWe.map((score, i) => {
              return <p key={'we-above-'+i}>{score}</p>
            })}
          </td>
          <td>
            {scoresAbove.teamThey.map((score, i) => {
              return <p key={'we-below-'+i}>{score}</p>
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
                  {scoresBelow.teamWe[i].map((score, j) => {
                    return <p key={'we-'+i+j}>{score}</p>
                  })}
                </td>
                <td>
                  {scoresBelow.teamThey[i].map((score, j) => {
                    return <p key={'they-'+i+j}>{score}</p>
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
