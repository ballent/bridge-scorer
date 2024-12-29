import { createContext, useState } from 'react'
import Scoresheet from '../Scoresheet/Scoresheet'
import Rubber from '../../utils/Rubber/Rubber'
import { IContractBid, IRubber, IRubberGameState } from '../../utils/Rubber/Rubber.types'
import BidHistory from '../BidHistory/BidHistory'
import BidModal from '../BidModal/BidModal'
import './BridgeGame.css'
import Reset from '../../assets/Reset'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import Bid from '../../utils/Bid'

const activeRubber: IRubber = JSON.parse(localStorage.getItem('activeRubber') || '{}')
interface IRubberContext {
  rubber: Rubber
  rubberHistory: Bid[]
  jumpToBid: (bids: IContractBid[]) => void
}

const rubber = Object.keys(activeRubber).length ? new Rubber(activeRubber) : new Rubber()

export const RubberContext = createContext<IRubberContext>({
  rubber: rubber,
  rubberHistory: [],
  jumpToBid: (_bids: IContractBid[]) => { return } 
})

const BridgeGame = () => {
  const [rubberGameState, setRubberGameState] = useState<IRubberGameState>(rubber.getState())
  const [rubberHistory, setRubberHistory] = useState<Bid[]>(rubberGameState.bidHistory)
  const [scoreIdHovering, setScoreIdHovering] = useState<null | number>(null)
  const [bidModalVisible, setBidModalVisible] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)

  const addOrUpdateBid = (bid: IContractBid, bidId?: number) => {
    const updatedGame = bidId === undefined ? rubber.sumbitBid(bid) : rubber.editBid(bid, bidId)
    const updatedGameState = updatedGame.getState()

    setRubberGameState(updatedGameState)
    setRubberHistory(updatedGameState.bidHistory)
    localStorage.setItem('activeRubber', JSON.stringify(rubber))
  }

  const handleDeleteBid = (bidId: number) => {
    const updatedGameState = rubber.deleteBid(bidId).getState()
    setRubberGameState(updatedGameState)
    setRubberHistory(updatedGameState.bidHistory) 
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
    <RubberContext.Provider value={{rubber, rubberHistory, jumpToBid}}>
      <div className="game-container">
        <Scoresheet
          scoresBelow={rubberGameState.scoresBelow}
          scoresAbove={rubberGameState.scoresAbove}
          scoreIdHovering={scoreIdHovering}
          setScoreIdHovering={setScoreIdHovering}
          onDeleteBid={handleDeleteBid}
          onEditBid={addOrUpdateBid}
        />
        <BidHistory
          bids={rubberHistory}
          scoreIdHovering={scoreIdHovering}
          setScoreIdHovering={setScoreIdHovering}
          onEditBid={addOrUpdateBid}
          onDeleteBid={handleDeleteBid}
          jumpTo={jumpToBid}
        />
      </div>
      {!rubberGameState.isGameOver && (
        <button className="add-bid" onClick={() => setBidModalVisible(true)}>
          +
        </button>
      )}
      <button className="reset-game" onClick={() => setConfirmationModalVisible(true)}>
        <Reset color={'white'} />
      </button>
      <div>{rubberGameState.isGameOver && 'Game over'}</div>
      <ConfirmationModal
        title="Reset game?"
        isVisible={confirmationModalVisible}
        setIsVisible={setConfirmationModalVisible}
        onConfirm={resetRubber}
      />
      <BidModal
        title="Create bid"
        isVisible={bidModalVisible}
        setIsVisible={setBidModalVisible}
        onSubmitBid={addOrUpdateBid}
      />
    </RubberContext.Provider>
  )
}

export default BridgeGame
