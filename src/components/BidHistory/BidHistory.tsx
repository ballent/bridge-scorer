import { IContractBid } from '../../utils/Rubber/Rubber.types'
import './BidHistory.css'
import { Fragment } from 'react/jsx-runtime'
import Bid from '../../utils/Bid'
import { useState } from 'react'
import BidInfoModal from '../BidInfoModal/BidInfoModal'
import ContractBid from '../ContractBid/ContractBid'
import Trash from '../../assets/Trash'
import Reset from '../../assets/Reset'
import Info from '../../assets/Info'

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
  onDeleteBid,
  jumpTo
}) => {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [showMath, setShowMath] = useState(false)

  const handleDeselectBid = (isVisible: boolean) => {
    !isVisible && setSelectedBid(null)
  }

  const handleDeleteBid = (bidId: number) => {
    onDeleteBid(bidId)
    setSelectedBid(null)
  }

  const handleJumpTo = (bidId: number) => {
    jumpTo(bids.map(bid => bid.contractBid).slice(0, bidId + 1))
    setSelectedBid(null)
  }

  const Bid = ({ bid }: { bid: Bid }) => {
    const contractBid = bid.contractBid
    const handleMouseEnter = () => {
      setScoreIdHovering(bid.id)
    }

    const handleMouseLeave = () => {
      setScoreIdHovering(null)
    }

    return (
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`bid-button ${scoreIdHovering === bid.id ? 'highlight-bid' : null}`}
        onClick={() => setSelectedBid(bid)}
      >
        <ContractBid bid={contractBid} /> 
      </button>
    )
  }

  const ModalTitle = () => {
    return (
      <>
        {selectedBid && (
          <div className='title-container'>
            <ContractBid bid={selectedBid.contractBid} style={{fontWeight: '700'}} />
            <button className='info' onClick={() => handleDeleteBid(selectedBid.id)}><Info color='grey' size={24} /></button>
            <button className='trash' onClick={() => handleDeleteBid(selectedBid.id)}><Trash color='white' size={24} /></button>
            <button className='reset' onClick={() => handleJumpTo(selectedBid.id)}><Reset color='white' size={24} /></button>
          </div>
        )}
      </>
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
          title={<ModalTitle />}
          isVisible={selectedBid !== null}
          showMath={showMath}
          setShowMath={setShowMath}
          setIsVisible={handleDeselectBid}
          onEditBid={onEditBid}
        />
      )}
    </div>
  )
}

export default BidHistory
