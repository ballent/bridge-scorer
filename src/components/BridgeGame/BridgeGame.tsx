import { useState } from 'react'
import BidInput from '../BidInput/BidInput'
import Scoresheet from '../Scoresheet/Scoresheet'
import Rubber from '../../utils/Rubber/Rubber'
import {
  IContractBid,
  IRubber,
  IRubberGameState
} from '../../utils/Rubber/Rubber.types'
import BidHistory from '../BidHistory/BidHistory'

const activeRubber: IRubber = JSON.parse(
  localStorage.getItem('activeRubber') || '{}'
)
const rubber = Object.keys(activeRubber).length
  ? new Rubber(activeRubber)
  : new Rubber()

const BridgeGame = () => {
  const [rubberGameState, setRubberGameState] = useState<IRubberGameState>(
    rubber.getState()
  )
  const [rubberHistory, setRubberHistory] = useState<IContractBid[]>(
    rubberGameState.bidHistory
  )

  const handleSubmitBid = (bid: IContractBid) => {
    setRubberGameState(rubber.sumbitBid(bid).getState())
    setRubberHistory(rubberGameState.bidHistory)
    localStorage.setItem('activeRubber', JSON.stringify(rubber))
  }

  const resetRubber = () => {
    rubber.resetRubber()
    localStorage.removeItem('activeRubber')
    const newGameState = rubber.getState()
    setRubberGameState(newGameState)
    setRubberHistory(newGameState.bidHistory)
  }

  const jumpToBid = (bids: IContractBid[]) => {
    setRubberGameState(rubber.jumpToGameState(bids).getState())
  }

  return (
    <>
      <BidInput onSubmit={handleSubmitBid} />
      <Scoresheet
        scoresBelow={rubberGameState.scoresBelow}
        scoresAbove={rubberGameState.scoresAbove}
      />
      <BidHistory bids={rubberHistory} jumpTo={jumpToBid} />
      <button onClick={() => resetRubber()}>Reset game</button>
      <div>{rubberGameState.isGameOver && 'Game over'}</div>
    </>
  )
}

export default BridgeGame
