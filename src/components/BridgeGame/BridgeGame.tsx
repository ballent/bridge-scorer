import { createContext, useState } from 'react'
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

export const RubberContext = createContext<Rubber>(rubber)

const BridgeGame = () => {
  const [rubberGameState, setRubberGameState] = useState<IRubberGameState>(
    rubber.getState()
  )
  const [rubberHistory, setRubberHistory] = useState<IContractBid[]>(
    rubberGameState.contractBidHistory
  )
  const [scoreIdHovering, setScoreIdHovering] = useState<null | number>(null)

  const handleSubmitBid = (bid: IContractBid) => {
    const newGameState = rubber.sumbitBid(bid).getState()
    setRubberGameState(newGameState)
    setRubberHistory(newGameState.contractBidHistory)
    localStorage.setItem('activeRubber', JSON.stringify(rubber))
  }

  const handleDeleteBid = (bidId: number) => {
    setRubberGameState(rubber.deleteBid(bidId).getState())
  }

  const handleEditBid = (bidId: number, bid: IContractBid) => {
    const newGameState = rubber.editBid(bidId, bid).getState()
    setRubberGameState(newGameState)
    setRubberHistory(newGameState.contractBidHistory)
  }

  const resetRubber = () => {
    rubber.resetRubber()
    localStorage.removeItem('activeRubber')
    const newGameState = rubber.getState()
    setRubberGameState(newGameState)
    setRubberHistory(newGameState.contractBidHistory)
  }

  const jumpToBid = (bids: IContractBid[]) => {
    setRubberGameState(rubber.jumpToGameState(bids).getState())
  }

  return (
    <RubberContext.Provider value={rubber}>
      <BidInput onSubmit={handleSubmitBid} />
      <Scoresheet
        scoresBelow={rubberGameState.scoresBelow}
        scoresAbove={rubberGameState.scoresAbove}
        scoreIdHovering={scoreIdHovering}
        setScoreIdHovering={setScoreIdHovering}
        onDeleteBid={handleDeleteBid}
        onEditBid={handleEditBid}
      />
      <BidHistory bids={rubberHistory} scoreIdHovering={scoreIdHovering} jumpTo={jumpToBid} />
      <button onClick={() => resetRubber()}>Reset game</button>
      <div>{rubberGameState.isGameOver && 'Game over'}</div>
    </RubberContext.Provider>
  )
}

export default BridgeGame
