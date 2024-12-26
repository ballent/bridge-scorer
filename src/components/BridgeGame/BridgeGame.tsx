import { createContext, useState } from 'react'
import Scoresheet from '../Scoresheet/Scoresheet'
import Rubber from '../../utils/Rubber/Rubber'
import { IContractBid, IRubber, IRubberGameState } from '../../utils/Rubber/Rubber.types'
import BidHistory from '../BidHistory/BidHistory'
import BidModal from '../BidModal/BidModal'
import './BridgeGame.css'
import { createPortal } from 'react-dom'

const activeRubber: IRubber = JSON.parse(localStorage.getItem('activeRubber') || '{}')
const rubber = Object.keys(activeRubber).length ? new Rubber(activeRubber) : new Rubber()

export const RubberContext = createContext<Rubber>(rubber)

const BridgeGame = () => {
  const [rubberGameState, setRubberGameState] = useState<IRubberGameState>(rubber.getState())
  const [rubberHistory, setRubberHistory] = useState<IContractBid[]>(
    rubberGameState.contractBidHistory
  )
  const [scoreIdHovering, setScoreIdHovering] = useState<null | number>(null)
  const [bidModalVisible, setBidModalVisible] = useState(false)

  const addOrUpdateBid = (bid: IContractBid, bidId?: number) => {
    const updatedGame = bidId === undefined ? rubber.sumbitBid(bid) : rubber.editBid(bid, bidId)
    const updatedGameState = updatedGame.getState()

    setRubberGameState(updatedGameState)
    setRubberHistory(updatedGameState.contractBidHistory)
    localStorage.setItem('activeRubber', JSON.stringify(rubber))
  }

  const handleDeleteBid = (bidId: number) => {
    setRubberGameState(rubber.deleteBid(bidId).getState())
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
      <div className='game-container'>
        <Scoresheet
          scoresBelow={rubberGameState.scoresBelow}
          scoresAbove={rubberGameState.scoresAbove}
          scoreIdHovering={scoreIdHovering}
          setScoreIdHovering={setScoreIdHovering}
          onDeleteBid={handleDeleteBid}
          onEditBid={addOrUpdateBid}
        />
        <BidHistory bids={rubberHistory} scoreIdHovering={scoreIdHovering} jumpTo={jumpToBid} />
      </div>
      {createPortal(<button className='add-bid' onClick={() => setBidModalVisible(true)}>+</button>, document.body)}
      <button onClick={() => resetRubber()}>Reset game</button>
      <div>{rubberGameState.isGameOver && 'Game over'}</div>
      <BidModal title="Create bid" isVisible={bidModalVisible} setIsVisible={setBidModalVisible} onSubmitBid={addOrUpdateBid} />
    </RubberContext.Provider>
  )
}

export default BridgeGame
