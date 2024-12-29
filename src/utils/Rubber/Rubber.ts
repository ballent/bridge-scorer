import Bid from '../Bid'
import RubberTeam from '../Team'
import {
  FAST_RUBBER_BONUS,
  SLOW_RUBBER_BONUS,
} from './constants'
import { IBidScore, IContractBid, IRubber, TEAM } from './Rubber.types'

class Rubber {
  vulnerableTeams: TEAM[]
  teamWe: RubberTeam
  teamThey: RubberTeam
  bidHistory: Bid[]
  gameIndex: number
  isGameOver: boolean

  constructor(rubber?: IRubber) {
    this.teamWe = rubber ? new RubberTeam(rubber.teamWe) : new RubberTeam()
    this.teamThey = rubber ? new RubberTeam(rubber.teamThey) : new RubberTeam()
    this.vulnerableTeams = rubber ? rubber.vulnerableTeams : []
    this.bidHistory = rubber ? rubber.bidHistory : []
    this.gameIndex = rubber ? rubber.gameIndex : 0
    this.isGameOver = rubber ? rubber.isGameOver : false
  }

  getState() {
    return {
      scoresAbove: {
        teamWe: this.teamWe.getScoreAbove(),
        teamThey: this.teamThey.getScoreAbove()
      },
      scoresBelow: {
        teamWe: this.teamWe.getScoreBelow(),
        teamThey: this.teamThey.getScoreBelow()
      },
      bidHistory: this.bidHistory,
      isGameOver: this.isGameOver
    }
  }

  sumbitBid(bid: IContractBid) {
    if (this.isGameOver) {
      return this
    }

    const bidContext = this.createBidContext(bid)
    return this.calculateBidPoints(bidContext)
  }

  createBidContext(bid: IContractBid) {
    const biddingTeam = bid.team === TEAM.WE ? this.teamWe : this.teamThey
    const dummyTeam = bid.team === TEAM.WE ? this.teamThey : this.teamWe
    const bidContext = new Bid(
      this.bidHistory.length,
      bid,
      this.vulnerableTeams.includes(bid.team),
      biddingTeam,
      dummyTeam
    )

    this.bidHistory.push(bidContext)
    return bidContext
  }

  calculateBidPoints(bidContext: Bid) {
    const contractBid = bidContext.contractBid
    // add any score below
    bidContext.biddingTeam.scoreBelow[this.gameIndex].push(bidContext.scoreBelow)

    // add any scores above and honors points
    bidContext.biddingTeam.scoreAbove.push(...bidContext.biddingTeamScoreAbove)
    bidContext.dummyTeam.scoreAbove.push(...bidContext.dummyTeamScoreAbove)

    if (this.isGameWin(bidContext.biddingTeam.scoreBelow[this.gameIndex])) {
      this.teamWe.scoreBelow.push([])
      this.teamThey.scoreBelow.push([])
      this.gameIndex++
      this.isGameOver = this.vulnerableTeams.includes(contractBid.team)
      this.isGameOver && this.finalizeGame(bidContext.biddingTeam, bidContext.id)
      !this.isGameOver && this.vulnerableTeams.push(contractBid.team)
    }
    return this
  }

  finalizeGame(biddingTeam: RubberTeam, bidId: number) {
    const slowRubber =
      this.vulnerableTeams.includes(TEAM.WE) && this.vulnerableTeams.includes(TEAM.THEY)

    const rubberBonus = slowRubber ? SLOW_RUBBER_BONUS : FAST_RUBBER_BONUS
    biddingTeam.scoreAbove.push({id: bidId, score: rubberBonus})
    this.teamWe.scoreBelow[this.gameIndex].push({id: -1, score: this.teamWe.getTotalScore()})
    this.teamThey.scoreBelow[this.gameIndex].push({id: -1, score: this.teamThey.getTotalScore()})
  }

  isGameWin(bids: IBidScore[]) {
    return bids.map(bid => bid.score).reduce((sum, num) => sum + num, 0) >= 100
  }

  jumpToGameState(bids: IContractBid[]) {
    this.resetRubber()
    for (const bid of bids) {
      this.sumbitBid(bid)
    }
    return this
  }

  getContractBidHistory() {
    return this.bidHistory.map((bid) => bid.contractBid)
  }

  deleteBid(bidId: number) {
    const newContractBidHistory = this.bidHistory
      .filter((bid) => bid.id !== bidId)
      .map((bid) => bid.contractBid)
    return this.jumpToGameState(newContractBidHistory)
  }

  getBidById(bidId: number) {
    return this.bidHistory[bidId]
  }

  getContractBidById(bidId: number) {
    return this.getContractBidHistory()[bidId]
  }

  editBid(bid: IContractBid, bidId: number) {
    const contractBids = this.getContractBidHistory()
    contractBids[bidId] = bid
    return this.jumpToGameState(contractBids)
  }

  resetRubber() {
    this.teamWe = new RubberTeam()
    this.teamThey = new RubberTeam()
    this.vulnerableTeams = []
    this.bidHistory = []
    this.gameIndex = 0
    this.isGameOver = false
  }
}

export default Rubber
