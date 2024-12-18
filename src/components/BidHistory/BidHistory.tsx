import { Fragment } from 'react/jsx-runtime'
import { IContractBid } from '../../utils/Rubber/Rubber.types'

interface BidHistoryProps {
  bids: IContractBid[]
  jumpTo: (bids: IContractBid[]) => void
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids, jumpTo }) => {
  return (
    <div>
      {bids.map((bid, i) => {
        return (
          <Fragment key={'bid-' + i}>
            <button onClick={() => jumpTo(bids.slice(0, i + 1))}>
              {bid.suit} {bid.contractTricks}{' '}
              {bid.tricksMade ? bid.tricksMade : ''}
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}

export default BidHistory
