import { Fragment } from 'react/jsx-runtime'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import './BidHistory.css'
import ContractResult from '../ContractResult/ContractResult'
import { displayDoubledMultiplier } from '../../utils/displayDoubleMulitplier'

interface BidHistoryProps {
  bids: IContractBid[]
  scoreIdHovering: number | null
  jumpTo: (bids: IContractBid[]) => void
}

const BidHistory: React.FC<BidHistoryProps> = ({ bids, scoreIdHovering, jumpTo }) => {
  return (
    <div className="bid-history-container">
      <span className="title">Bids</span>
      {bids.map((bid, i) => {
        return (
          <Fragment key={'bid-' + i}>
            <button
              className={`bid-button ${scoreIdHovering === i ? 'highlight-bid' : null}`}
              onClick={() => jumpTo(bids.slice(0, i + 1))}
            >
              <span className="centered">
                {bid.team} {bid.contractTricks}
                {bid.suit} <ContractResult value={bid.tricksMade} size={24} style={{marginLeft: '7px'}} />
              </span>
              {displayDoubledMultiplier(bid.doubledMultiplier)}
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}

export default BidHistory
