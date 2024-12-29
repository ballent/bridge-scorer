import {
  DOUBLED_BASE_VALUE,
  GS_BONUS_BASE_VALUE,
  POINTS_MAJOR,
  POINTS_MINOR,
  SS_BONUS_BASE_VALUE,
  UNDERTRICK_BASE_VALUE,
  UNDERTRICK_DOUBLED_LOOKUP,
  UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP
} from './Rubber/constants'
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
  nonBiddingTeam: RubberTeam
  scoreBelow: IBidScore
  biddingTeamScoreAbove: IBidScore[]
  nonBiddingTeamScoreAbove: IBidScore[]
  biddingTeamScoreDescription: { scoreAbove: string; scoreBelow: string }
  nonBiddingTeamScoreDescription: string

  constructor(
    id: number,
    contractBid: IContractBid,
    isBiddingTeamVulnerable: boolean,
    biddingTeam: RubberTeam,
    nonBiddingTeam: RubberTeam
  ) {
    const bidMultiplier = contractBid.doubledMultiplier
    const isBidDoubledOrRedoubled = contractBid.doubledMultiplier > 1
    const vulnerableMultiplier = isBiddingTeamVulnerable ? 2 : 1
    const pointsPerTrick = this.getPointsPerTrick(contractBid.suit, bidMultiplier)

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
    this.nonBiddingTeam = nonBiddingTeam
    this.biddingTeamScoreDescription = { scoreAbove: '', scoreBelow: '' }
    this.nonBiddingTeamScoreDescription = ''
    this.scoreBelow = this.calculateScoreBelow()
    this.biddingTeamScoreAbove = this.calculateBiddingTeamScoreAbove()
    this.nonBiddingTeamScoreAbove = this.calculateNonBiddingTeamScoreAbove()
  }

  getPointsPerTrick(suit: SUIT, doubledBidMultiplier: number) {
    if (suit === SUIT.CLUBS || suit === SUIT.DIAMONDS) {
      return POINTS_MINOR * doubledBidMultiplier
    }
    return POINTS_MAJOR * doubledBidMultiplier
  }

  calculateScoreBelow() {
    if (this.contractBid.tricksMade < 0) {
      return { id: this.id, score: 0 }
    }
    const noTrumpBonus = this.contractBid.suit === SUIT.NO_TRUMP ? 10 : 0
    const pointsBelow = {
      id: this.id,
      score: this.pointsPerTrick * this.contractBid.contractTricks + noTrumpBonus
    }

    const description = noTrumpBonus
      ? `40 + ${this.pointsPerTrick} * ${this.contractBid.contractTricks - 1}`
      : `${this.pointsPerTrick} * ${this.contractBid.contractTricks}`
    this.biddingTeamScoreDescription.scoreBelow += description + ` = ${pointsBelow.score}`
    return pointsBelow
  }

  calculateBiddingTeamScoreAbove() {
    const bidScore = { id: this.id }
    const biddingScoresAbove: IBidScore[] = []
    const isBidMade = this.contractBid.tricksMade >= 0

    // overtricks
    if (this.contractBid.tricksMade > 0) {
      const overTrickPoints = this.pointsPerOverTrick * this.contractBid.tricksMade
      this.biddingTeamScoreDescription.scoreAbove += `${this.pointsPerTrick} * ${this.contractBid.tricksMade} = ${overTrickPoints} (overtricks)\n`
      biddingScoresAbove.push({ ...bidScore, score: overTrickPoints })
    }

    // slam bonus
    if (isBidMade && (this.isSmallSlamBid || this.isGrandSlamBid)) {
      const slamVulnerableMultiplier = this.isBiddingTeamVulnerable ? 1.5 : 1
      const slamBonus = this.isSmallSlamBid ? SS_BONUS_BASE_VALUE : GS_BONUS_BASE_VALUE
      const totalSlamBonus = slamBonus * slamVulnerableMultiplier
      this.biddingTeamScoreDescription.scoreAbove += `${slamBonus} (${
        !this.isBiddingTeamVulnerable ? 'non-' : ''
      }vulnerable slam bonus)\n`
      biddingScoresAbove.push({ ...bidScore, score: totalSlamBonus })
    }

    // honors
    if (this.contractBid.honorsWe && this.contractBid.team === TEAM.WE) {
      biddingScoresAbove.push({ ...bidScore, score: this.contractBid.honorsWe })
      this.biddingTeamScoreDescription.scoreAbove += `${this.contractBid.honorsWe} (honors)\n`
    }
    if (this.contractBid.honorsThey && this.contractBid.team === TEAM.THEY) {
      biddingScoresAbove.push({ ...bidScore, score: this.contractBid.honorsThey })
      this.biddingTeamScoreDescription.scoreAbove += `${this.contractBid.honorsThey} (honors)\n`
    }

    // insult bonus
    if (isBidMade && this.isBidDoubledOrRedoubled) {
      const doubledBidInsultBonus = DOUBLED_BASE_VALUE * (this.bidMultiplier / 2)
      biddingScoresAbove.push({ ...bidScore, score: doubledBidInsultBonus })
      this.biddingTeamScoreDescription.scoreAbove += `${doubledBidInsultBonus} (${
        this.bidMultiplier > 2 ? 're' : ''
      }doubled insult bonus)\n`
    }

    return biddingScoresAbove
  }

  calculateNonBiddingTeamScoreAbove() {
    const nonBiddingTeamScoresAbove: IBidScore[] = []
    const bidScore = { id: this.id }
    if (this.contractBid.honorsWe && this.contractBid.team === TEAM.THEY) {
      nonBiddingTeamScoresAbove.push({ ...bidScore, score: this.contractBid.honorsWe })
      this.nonBiddingTeamScoreDescription += `${this.contractBid.honorsWe} (honors)\n`
    }
    if (this.contractBid.honorsThey && this.contractBid.team === TEAM.WE) {
      nonBiddingTeamScoresAbove.push({ ...bidScore, score: this.contractBid.honorsThey })
      this.nonBiddingTeamScoreDescription += `${this.contractBid.honorsThey} (honors)\n`
    }

    if (this.contractBid.tricksMade >= 0) {
      return nonBiddingTeamScoresAbove
    }

    const underTricks = Math.abs(this.contractBid.tricksMade)

    // bidding team went down
    if (!this.isBidDoubledOrRedoubled) {
      const penaltyPointsAbove = underTricks * (UNDERTRICK_BASE_VALUE * this.vulnerableMultiplier)
      nonBiddingTeamScoresAbove.push({ ...bidScore, score: penaltyPointsAbove })
      this.nonBiddingTeamScoreDescription += `${underTricks} * ${
        UNDERTRICK_BASE_VALUE * this.vulnerableMultiplier
      } = ${penaltyPointsAbove} (${!this.isBiddingTeamVulnerable ? 'non-' : ''}vulnerable undertricks)\n`
      return nonBiddingTeamScoresAbove
    }

    // bid was doubled
    let doubledPenaltyPoints = 0
    let description = ''
    const lookupList = this.isBiddingTeamVulnerable
      ? UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP
      : UNDERTRICK_DOUBLED_LOOKUP

    for (let i = 0; i < underTricks; i++) {
      const lookupIndex = i > lookupList.length - 1 ? lookupList.length - 1 : i
      doubledPenaltyPoints += lookupList[lookupIndex]
      description += `${lookupList[lookupIndex]} ${i+1 < underTricks ? '+ ' : ''}`
    }
    nonBiddingTeamScoresAbove.push({ ...bidScore, score: doubledPenaltyPoints })
    this.nonBiddingTeamScoreDescription += `${description}(doubled ${!this.isBiddingTeamVulnerable ? 'non-' : ''}vulerable undertricks)\n`

    return nonBiddingTeamScoresAbove
  }
}

export default Bid
