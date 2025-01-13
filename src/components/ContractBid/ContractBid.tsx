import { CSSProperties } from 'react'
import { displayDoubledMultiplier } from '../../utils/displayDoubleMulitplier'
import { IContractBid } from '../../utils/Rubber/Rubber.types'
import ContractResult from '../ContractResult/ContractResult'
import './ContractBid.css'

interface ContractBidProps {
  bid: IContractBid
  style?: CSSProperties
}

const ContractBid = ({ bid, style }: ContractBidProps) => {
  return (
    <span className="contract-bid" style={style}>
      <span className="team">{bid.team}</span> {bid.contractTricks}
      {bid.suit} <ContractResult value={bid.tricksMade} size={24} />
      {displayDoubledMultiplier(bid.doubledMultiplier)}
    </span>
  )
}

export default ContractBid
