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
import useScreenSizes from '../../hooks/useScreenSizes'
import Plus from '../../assets/Plus'

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
  jumpToBid: (_bids: IContractBid[]) => {
    return
  }
})

const BridgeGame = () => {
  const [rubberGameState, setRubberGameState] = useState<IRubberGameState>(rubber.getState())
  const [rubberHistory, setRubberHistory] = useState<Bid[]>(rubberGameState.bidHistory)
  const [scoreIdHovering, setScoreIdHovering] = useState<null | number>(null)
  const [bidModalVisible, setBidModalVisible] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)

  const { isMobile } = useScreenSizes()

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
    <RubberContext.Provider value={{ rubber, rubberHistory, jumpToBid }}>
      <div className='container' style={{ height: window.innerHeight }}>
        <div className="game-container">
          <Scoresheet
            scoresBelow={rubberGameState.scoresBelow}
            scoresAbove={rubberGameState.scoresAbove}
            scoreIdHovering={scoreIdHovering}
            setScoreIdHovering={setScoreIdHovering}
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
        <div className={`${isMobile ? 'controls-container-sm' : 'controls-container'}`}>
          <button
            className={`control ${!isMobile ? 'padding-horizontal' : null}`}
            style={isMobile ? { position: 'fixed', bottom: 25, left: 25, width: 50 } : {}}
            onClick={() => setConfirmationModalVisible(true)}
          >
            {!isMobile && 'Reset'}
            <Reset color={'white'} />
          </button>
          {!rubberGameState.isGameOver && (
            <button
              className={`control ${!isMobile ? 'padding-horizontal' : null}`}
              style={isMobile ? { position: 'fixed', bottom: 25, right: 25, width: 50 } : {}}
              onClick={() => setBidModalVisible(true)}
            >
              {!isMobile && 'Add bid '}
              <Plus color={'white'} />
            </button>
          )}
        </div>
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
      </div>
    </RubberContext.Provider>
  )
}

export default BridgeGame
