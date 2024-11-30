import { IBid, SUIT, TEAM } from './Bid'
import RubberTeam from './Team'

const POINTS_MINOR = 20
const POINTS_MAJOR = 30
const DOUBLED_BASE_VALUE = 50

const UNDERTRICK_BASE_VALUE = 50
const UNDERTRICK_DOUBLED_LOOKUP = [100, 200, 200, 300]
const UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP = [200, 300]

export interface IRubberGameState {
  scoresAbove: number[][]
  scoresBelow: number[][]
}

class Rubber {
  state: IRubberGameState
  vulnerableTeams: TEAM[]
  teamWe: RubberTeam
  teamThey: RubberTeam
  bidHistory: IBid[]
  gameIndex: number
  gameOver: boolean

  constructor(rubber?: IRubberGameState) {
    this.state = rubber ? rubber : { scoresAbove: [[0, 0]], scoresBelow: [[0, 0]] }
    this.teamWe = new RubberTeam()
    this.teamThey = new RubberTeam()
    this.vulnerableTeams = []
    this.bidHistory = []
    this.gameIndex = 0
    this.gameOver = false
  }
  
  sumbitBid(bid: IBid) {
    if (this.gameOver) {
      return this
    }
    this.bidHistory.push(bid)
    const bidMultiplier = (bid.isRedoubled ? 4 : bid.isDoubled ? 2 : 1)
    const isBidDoubledOrRedoubled = bid.isDoubled || bid.isRedoubled
    const biddingTeam = bid.team === TEAM.WE ? this.teamWe : this.teamThey
    const dummyTeam = bid.team === TEAM.WE ? this.teamThey : this.teamWe
    const noTrumpBonus = bid.suit === SUIT.NO_TRUMP ? 10 : 0
    const biddingTeamVulnerable = this.vulnerableTeams.includes(bid.team)
    const vulnerableMultiplier = biddingTeamVulnerable ? 2 : 1

    const pointsPerTrick = this.pointsPerTrick(bid.suit, bidMultiplier)
    const pointsPerOverTrick = isBidDoubledOrRedoubled ? (DOUBLED_BASE_VALUE * bidMultiplier) * vulnerableMultiplier : pointsPerTrick;

    // bidding team went under
    if (bid.tricksMade < 0) {
      const underTricks = Math.abs(bid.tricksMade)
      if (!bid.isDoubled && !bid.isRedoubled) {
        dummyTeam.scoreAbove.push(underTricks * (UNDERTRICK_BASE_VALUE * vulnerableMultiplier))
        return this
      }

      // bid was doubled
      let penaltyPoints = 0
      const lookupList = biddingTeamVulnerable ? UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP : UNDERTRICK_DOUBLED_LOOKUP
      for (let i = 0; i < underTricks; i++) {
        const lookupIndex = i > lookupList.length ? lookupList.length - 1 : i 
        penaltyPoints += UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP[lookupIndex]
      }
      dummyTeam.scoreAbove.push(penaltyPoints)
      return this
    }
    if (bid.tricksMade > 0) {
      biddingTeam.scoreAbove.push(pointsPerOverTrick * bid.tricksMade)
    }
    biddingTeam.scoreBelow[this.gameIndex].push(pointsPerTrick * bid.contractTricks + noTrumpBonus)
    // todo determine game over
    if (this.isGameWin(biddingTeam.scoreBelow[this.gameIndex])) {
      this.teamWe.scoreBelow.push([])
      this.teamThey.scoreBelow.push([])
      this.gameOver = this.vulnerableTeams.includes(bid.team)
      this.vulnerableTeams.push(bid.team)
      this.gameIndex++
    }
    return this
  }

  getBidHistory() {
    return this.bidHistory
  }

  pointsPerTrick(suit: SUIT, doubledBidMultiplier: number) {
    if (suit === SUIT.CLUBS || suit === SUIT.DIAMONDS){
      return POINTS_MINOR * doubledBidMultiplier
    }
    return POINTS_MAJOR * doubledBidMultiplier
  }

  getScoreBelowWe() {
    return this.teamWe.getScoreBelow()
  }

  getScoreBelowThey() {
    return this.teamThey.getScoreBelow()
  }

  getScoresBelow() {
    return {
      'teamWe': this.teamWe.scoreBelow,
      'teamThey': this.teamThey.scoreBelow
    }
  }

  getScoresAbove() {
    return {
      'teamWe': this.teamWe.scoreAbove,
      'teamThey': this.teamThey.scoreAbove
    }
  }

  isGameWin(scores: number[]) {
    return scores.reduce((sum, num) => sum + num, 0) >= 100
  }

  getGameOver() {
    return this.gameOver
  }
}

export default Rubber
