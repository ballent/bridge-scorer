import { useState } from 'react'
import BidInput from '../BidInput/BidInput'
import Scoresheet from '../Scoresheet/Scoresheet'
import Rubber from '../../utils/Rubber'
import { IBid } from '../../utils/Bid'
import BidHistory from '../BidHistory/BidHistory'

const BridgeGame = () => {
  const [rubber, setRubber] = useState<Rubber>(new Rubber())
  const [scoresBelow, setScoresBelow] = useState(rubber.getScoresBelow())
  const [scoresAbove, setScoresAbove] = useState(rubber.getScoresAbove())
  const [bidHistory, setBidHistory] = useState(rubber.getBidHistory())
  const [gameOver, setGameOver] = useState(rubber.getGameOver())

  const handleSubmitBid = (bid: IBid) => {
    setRubber(rubber.sumbitBid(bid))
    setScoresBelow(rubber.getScoresBelow())
    setScoresAbove(rubber.getScoresAbove())
    setBidHistory([...rubber.getBidHistory()])
    setGameOver(rubber.getGameOver())
  }

  return (
    <>
      <BidInput onSubmit={(bid) => handleSubmitBid(bid)} />
      <Scoresheet scoresBelow={scoresBelow} scoresAbove={scoresAbove}/>
      <BidHistory bids={bidHistory} />
      <div>{gameOver && "Game over"}</div>
    </>
  )
}

export default BridgeGame
