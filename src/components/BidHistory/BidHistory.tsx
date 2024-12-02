import { Fragment } from 'react/jsx-runtime'
import { IBid } from '../../utils/Rubber/Rubber.types'

interface BidHistoryProps {
  bids: IBid[]
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids }) => {
  return (
    <div>
      {bids.map((bid, i) => {
        return (
          <Fragment key={"bid-"+i}>
            <div>{bid.suit} {bid.contractTricks} {bid.tricksMade ? bid.tricksMade : ''}</div>
          </Fragment>
        )
      })}
    </div>
  )
}

export default BidHistory
