import { useState } from 'react'
import BidInput from '../BidInput/BidInput'
import Scoresheet from '../Scoresheet/Scoresheet'
import Rubber from '../../utils/Rubber/Rubber'
import { IBid, IRubber, IRubberGameState } from '../../utils/Rubber/Rubber.types'
import BidHistory from '../BidHistory/BidHistory'

const activeRubber: IRubber = JSON.parse(localStorage.getItem('activeRubber') || '{}')
const rubber = Object.keys(activeRubber).length ? new Rubber(activeRubber) : new Rubber()

const BridgeGame = () => {
  const [rubberGameState, setRubberGameState] = useState<IRubberGameState>(
    rubber.getState()
  )

  const handleSubmitBid = (bid: IBid) => {
    setRubberGameState(rubber.sumbitBid(bid).getState())
    localStorage.setItem('activeRubber', JSON.stringify(rubber))
  }
  
  const resetRubber = () => {
    rubber.resetRubber()
    localStorage.removeItem('activeRubber')
    setRubberGameState(rubber.getState())
  }

  return (
    <>
      <BidInput onSubmit={handleSubmitBid} />
      <Scoresheet
        scoresBelow={rubberGameState.scoresBelow}
        scoresAbove={rubberGameState.scoresAbove}
      />
      <BidHistory bids={rubberGameState.bidHistory} />
      <button onClick={() => resetRubber()}>Reset game</button>
      <div>{rubberGameState.isGameOver && 'Game over'}</div>
    </>
  )
}

export default BridgeGame
