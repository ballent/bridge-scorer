import RubberTeam from '../Team'
import {
  DOUBLED_BASE_VALUE,
  POINTS_MAJOR,
  POINTS_MINOR,
  UNDERTRICK_BASE_VALUE,
  UNDERTRICK_DOUBLED_LOOKUP,
  UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP
} from './constants'
import { IBid, IBidContext, SUIT, TEAM } from './Rubber.types'

class Rubber {
  vulnerableTeams: TEAM[]
  teamWe: RubberTeam
  teamThey: RubberTeam
  bidHistory: IBid[]
  gameIndex: number
  isGameOver: boolean

  constructor() {
    this.teamWe = new RubberTeam()
    this.teamThey = new RubberTeam()
    this.vulnerableTeams = []
    this.bidHistory = []
    this.gameIndex = 0
    this.isGameOver = false
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

  sumbitBid(bid: IBid) {
    if (this.isGameOver) {
      return this
    }
    this.bidHistory.push(bid)

    const bidContext = this.createBidContext(bid)

    // bidding team went under
    if (bid.tricksMade < 0) {
      return this.calculatePentalyPoints(bidContext)
    }
    // bid was made or made over tricks
    return this.calculateSuccessfulBidPoints(bidContext)
  }

  createBidContext(bid: IBid) {
    const bidMultiplier = bid.isRedoubled ? 4 : bid.isDoubled ? 2 : 1
    const biddingTeamVulnerable = this.vulnerableTeams.includes(bid.team)
    const isBidDoubledOrRedoubled = bid.isDoubled || bid.isRedoubled
    const vulnerableMultiplier = biddingTeamVulnerable ? 2 : 1
    const pointsPerTrick = this.getPointsPerTrick(bid.suit, bidMultiplier)

    return {
      bid,
      bidMultiplier,
      biddingTeamVulnerable,
      isBidDoubledOrRedoubled,
      vulnerableMultiplier,
      pointsPerTrick,
      biddingTeam: bid.team === TEAM.WE ? this.teamWe : this.teamThey,
      dummyTeam: bid.team === TEAM.WE ? this.teamThey : this.teamWe,
      pointsPerOverTrick: isBidDoubledOrRedoubled
        ? DOUBLED_BASE_VALUE * bidMultiplier * vulnerableMultiplier
        : pointsPerTrick
    }
  }

  getPointsPerTrick(suit: SUIT, doubledBidMultiplier: number) {
    if (suit === SUIT.CLUBS || suit === SUIT.DIAMONDS) {
      return POINTS_MINOR * doubledBidMultiplier
    }
    return POINTS_MAJOR * doubledBidMultiplier
  }

  calculatePentalyPoints(bidContext: IBidContext) {
    const underTricks = Math.abs(bidContext.bid.tricksMade)
    if (!bidContext.bid.isDoubled && !bidContext.bid.isRedoubled) {
      bidContext.dummyTeam.scoreAbove.push(
        underTricks * (UNDERTRICK_BASE_VALUE * bidContext.vulnerableMultiplier)
      )
      return this
    }

    // bid was doubled
    let penaltyPoints = 0
    const lookupList = bidContext.biddingTeamVulnerable
      ? UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP
      : UNDERTRICK_DOUBLED_LOOKUP

    for (let i = 0; i < underTricks; i++) {
      const lookupIndex = i > lookupList.length ? lookupList.length - 1 : i
      penaltyPoints += UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP[lookupIndex]
    }
    bidContext.dummyTeam.scoreAbove.push(penaltyPoints)

    return this
  }

  calculateSuccessfulBidPoints(bidContext: IBidContext) {
    const noTrumpBonus = bidContext.bid.suit === SUIT.NO_TRUMP ? 10 : 0

    if (bidContext.bid.tricksMade > 0) {
      bidContext.biddingTeam.scoreAbove.push(
        bidContext.pointsPerOverTrick * bidContext.bid.tricksMade
      )
    }
    bidContext.biddingTeam.scoreBelow[this.gameIndex].push(
      bidContext.pointsPerTrick * bidContext.bid.contractTricks + noTrumpBonus
    )

    if (this.isGameWin(bidContext.biddingTeam.scoreBelow[this.gameIndex])) {
      this.teamWe.scoreBelow.push([])
      this.teamThey.scoreBelow.push([])
      this.isGameOver = this.vulnerableTeams.includes(bidContext.bid.team)
      this.vulnerableTeams.push(bidContext.bid.team)
      this.gameIndex++
    }
    return this
  }

  isGameWin(scores: number[]) {
    return scores.reduce((sum, num) => sum + num, 0) >= 100
  }
}

export default Rubber
