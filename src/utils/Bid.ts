import { DOUBLED_BASE_VALUE, GS_BONUS_BASE_VALUE, POINTS_MAJOR, POINTS_MINOR, SS_BONUS_BASE_VALUE, UNDERTRICK_BASE_VALUE, UNDERTRICK_DOUBLED_LOOKUP, UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP } from './Rubber/constants'
import { IBidScore, IContractBid, SUIT, TEAM } from './Rubber/Rubber.types'
import RubberTeam from './Team'

class Bid {
  id: number
  contractBid: IContractBid
  isBiddingTeamVulnerable: boolean
  bidMultiplier: number
  isBidDoubledOrRedoubled: boolean
  vulnerableMultiplier: number
  pointsPerTrick: number
  pointsPerOverTrick: number
  isSmallSlamBid: boolean
  isGrandSlamBid: boolean
  biddingTeam: RubberTeam
  dummyTeam: RubberTeam
  scoreBelow: IBidScore
  biddingTeamScoreAbove: IBidScore[]
  dummyTeamScoreAbove: IBidScore[]

  constructor(
    id: number,
    contractBid: IContractBid,
    isBiddingTeamVulnerable: boolean,
    biddingTeam: RubberTeam,
    dummyTeam: RubberTeam
  ) {
    const bidMultiplier = contractBid.doubledMultiplier
    const isBidDoubledOrRedoubled = contractBid.doubledMultiplier > 1
    const vulnerableMultiplier = isBiddingTeamVulnerable ? 2 : 1
    const pointsPerTrick = this.getPointsPerTrick(contractBid.suit, bidMultiplier)
    const noTrumpBonus = contractBid.suit === SUIT.NO_TRUMP ? 10 : 0

    this.id = id
    this.contractBid = contractBid
    this.isBiddingTeamVulnerable = isBiddingTeamVulnerable
    this.bidMultiplier = bidMultiplier
    this.isBidDoubledOrRedoubled = isBidDoubledOrRedoubled
    this.vulnerableMultiplier = vulnerableMultiplier
    this.pointsPerTrick = pointsPerTrick
    this.pointsPerOverTrick = isBidDoubledOrRedoubled
      ? DOUBLED_BASE_VALUE * bidMultiplier * vulnerableMultiplier
      : pointsPerTrick
    this.isSmallSlamBid = contractBid.contractTricks === 6
    this.isGrandSlamBid = contractBid.contractTricks === 7
    this.biddingTeam = biddingTeam
    this.dummyTeam = dummyTeam
    this.scoreBelow = {id: id, score: pointsPerTrick * contractBid.contractTricks + noTrumpBonus}
    this.biddingTeamScoreAbove = this.calculateBiddingTeamScoreAbove()
    this.dummyTeamScoreAbove = this.calculateDummyTeamScoreAbove()
  }

  getPointsPerTrick(suit: SUIT, doubledBidMultiplier: number) {
    if (suit === SUIT.CLUBS || suit === SUIT.DIAMONDS) {
      return POINTS_MINOR * doubledBidMultiplier
    }
    return POINTS_MAJOR * doubledBidMultiplier
  }

  calculateBiddingTeamScoreAbove() {
    const bidScore = {id: this.id}
    const biddingScoresAbove: IBidScore[] = []

    // overtricks
    if (this.contractBid.tricksMade > 0) {
      const overTrickPoints = this.pointsPerOverTrick * this.contractBid.tricksMade
      biddingScoresAbove.push({...bidScore, score: overTrickPoints})
    }

    // slam bonus
    if (this.isSmallSlamBid || this.isGrandSlamBid) {
      const slamVulnerableMultiplier = this.isBiddingTeamVulnerable ? 1.5 : 1
      const slamBonus = this.isSmallSlamBid ? SS_BONUS_BASE_VALUE : GS_BONUS_BASE_VALUE
      const totalSlamBonus = slamBonus * slamVulnerableMultiplier
      biddingScoresAbove.push({...bidScore, score: totalSlamBonus})
    }

    // honors
    if (this.contractBid.honorsWe && this.contractBid.team === TEAM.WE) {
      biddingScoresAbove.push({...bidScore, score: this.contractBid.honorsWe})
    }
    if (this.contractBid.honorsThey && this.contractBid.team === TEAM.THEY) {
      biddingScoresAbove.push({...bidScore, score: this.contractBid.honorsThey})
    }

    // insult bonus
    if (this.isBidDoubledOrRedoubled) {
      const doubledBidInsultBonus = DOUBLED_BASE_VALUE * (this.bidMultiplier / 2)
      biddingScoresAbove.push({...bidScore, score: doubledBidInsultBonus})
    }

    return biddingScoresAbove
  }

  calculateDummyTeamScoreAbove() {
    const dummyScoresAbove: IBidScore[] = []
    const bidScore = {id: this.id}
    if (this.contractBid.honorsWe && this.contractBid.team === TEAM.THEY) {
      dummyScoresAbove.push({...bidScore, score: this.contractBid.honorsWe})
    }
    if (this.contractBid.honorsThey && this.contractBid.team === TEAM.WE) {
      dummyScoresAbove.push({...bidScore, score: this.contractBid.honorsThey})
    }

    if (this.contractBid.tricksMade >= 0) {
      return dummyScoresAbove
    }

    const underTricks = Math.abs(this.contractBid.tricksMade)

    // bidding team went down
    if (!this.isBidDoubledOrRedoubled) {
      const penaltyPointsAbove =
        underTricks * (UNDERTRICK_BASE_VALUE * this.vulnerableMultiplier)
      dummyScoresAbove.push({...bidScore, score: penaltyPointsAbove})
      return dummyScoresAbove
    }

    // bid was doubled
    let doubledPenaltyPoints = 0
    const lookupList = this.isBiddingTeamVulnerable
      ? UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP
      : UNDERTRICK_DOUBLED_LOOKUP

    for (let i = 0; i < underTricks; i++) {
      const lookupIndex = i > lookupList.length - 1 ? lookupList.length - 1 : i
      doubledPenaltyPoints += lookupList[lookupIndex]
    }
    dummyScoresAbove.push({...bidScore, score: doubledPenaltyPoints})
    return dummyScoresAbove
  }
}

export default Bid
