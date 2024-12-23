import { Fragment } from 'react/jsx-runtime'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import './BidHistory.css'

interface BidHistoryProps {
  bids: IContractBid[]
  scoreIdHovering: number | null
  jumpTo: (bids: IContractBid[]) => void
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids, scoreIdHovering, jumpTo }) => {
  return (
    <div>
      {bids.map((bid, i) => {
        return (
          <Fragment key={'bid-' + i}>
            <button className={`${scoreIdHovering === i ? 'highlight-bid' : null}`} onClick={() => jumpTo(bids.slice(0, i + 1))}>
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
