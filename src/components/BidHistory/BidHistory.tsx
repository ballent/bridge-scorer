import { IContractBid } from '../../utils/Rubber/Rubber.types'
import './BidHistory.css'
import { Fragment } from 'react/jsx-runtime'
import Bid from '../../utils/Bid'
import { useState } from 'react'
import BidInfoModal from '../BidInfoModal/BidInfoModal'
import ContractBid from '../ContractBid/ContractBid'

interface BidHistoryProps {
  bids: Bid[]
  scoreIdHovering: number | null
  setScoreIdHovering: (id: number | null) => void
  onEditBid: (bid: IContractBid, bidId?: number) => void
  onDeleteBid: (bidId: number) => void
  jumpTo: (bids: IContractBid[]) => void
}

const BidHistory: React.FC<BidHistoryProps> = ({
  bids,
  scoreIdHovering,
  setScoreIdHovering,
  onEditBid,
  onDeleteBid
}) => {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)

  const handleDeselectBid = (isVisible: boolean) => {
    !isVisible && setSelectedBid(null)
  }

  const Bid = ({ bid }: { bid: Bid }) => {
    const contractBid = bid.contractBid
    const handleMouseEnter = () => {
      setScoreIdHovering(bid.id)
    }

    const handleMouseLeave = () => {
      setScoreIdHovering(null)
    }

    const handleClick = () => {
      setSelectedBid(bid)
      setScoreIdHovering(null)
    }

    return (
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`bid-button ${scoreIdHovering === bid.id ? 'highlight-bid' : null}`}
        onClick={handleClick}
      >
        <ContractBid bid={contractBid} />
      </button>
    )
  }

  return (
    <div className="bid-history-container">
      <span className="title">Bids</span>
      {bids.map((bid, i) => {
        return (
          <Fragment key={'bid-' + i}>
            <Bid bid={bid} />
          </Fragment>
        )
      })}
      {selectedBid && (
        <BidInfoModal
          bid={selectedBid}
          isVisible={selectedBid !== null}
          setIsVisible={handleDeselectBid}
          onEditBid={onEditBid}
          onDeleteBid={onDeleteBid}
        />
      )}
    </div>
  )
}

export default BidHistory
