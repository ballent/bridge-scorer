import { DOUBLED_BASE_VALUE, POINTS_MAJOR, POINTS_MINOR } from './Rubber/constants'
import { IContractBid, SUIT } from './Rubber/Rubber.types'
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
  scoreBelow: number
  biddingTeamScoreAbove: number[] | null
  dummyTeamScoreAbove: number[] | null

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
    this.scoreBelow = pointsPerTrick * contractBid.contractTricks + noTrumpBonus
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
    return []
  }

  calculateDummyTeamScoreAbove() {
    return []
  }
}

export default Bid
