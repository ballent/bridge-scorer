import { useState } from 'react'
import BidInput from '../BidInput/BidInput'
import Scoresheet from '../Scoresheet/Scoresheet'
import Rubber from '../../utils/Rubber/Rubber'
import { IBid, IRubberGameState } from '../../utils/Rubber/Rubber.types'
import BidHistory from '../BidHistory/BidHistory'

const rubber = new Rubber()

const BridgeGame = () => {
  const [rubberGameState, setRubberGameState] = useState<IRubberGameState>(
    rubber.getState()
  )

  const handleSubmitBid = (bid: IBid) => {
    setRubberGameState(rubber.sumbitBid(bid).getState())
  }

  return (
    <>
      <BidInput onSubmit={handleSubmitBid} />
      <Scoresheet
        scoresBelow={rubberGameState.scoresBelow}
        scoresAbove={rubberGameState.scoresAbove}
      />
      <BidHistory bids={rubberGameState.bidHistory} />
      <div>{rubberGameState.isGameOver && 'Game over'}</div>
    </>
  )
}

export default BridgeGame
