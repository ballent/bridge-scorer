import Bid from '../Bid'
import RubberTeam from '../Team'
import {
  DOUBLED_BASE_VALUE,
  FAST_RUBBER_BONUS,
  GS_BONUS_BASE_VALUE,
  SLOW_RUBBER_BONUS,
  SS_BONUS_BASE_VALUE,
  UNDERTRICK_BASE_VALUE,
  UNDERTRICK_DOUBLED_LOOKUP,
  UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP
} from './constants'
import {
  IContractBid,
  IBidScore,
  IRubber,
  SUIT,
  TEAM
} from './Rubber.types'

class Rubber {
  vulnerableTeams: TEAM[]
  teamWe: RubberTeam
  teamThey: RubberTeam
  bidHistory: Bid[]
  gameIndex: number
  isGameOver: boolean
  bidId: number

  constructor(rubber?: IRubber) {
    this.teamWe = rubber ? new RubberTeam(rubber.teamWe) : new RubberTeam()
    this.teamThey = rubber ? new RubberTeam(rubber.teamThey) : new RubberTeam()
    this.vulnerableTeams = rubber ? rubber.vulnerableTeams : []
    this.bidHistory = rubber ? rubber.bidHistory : []
    this.gameIndex = rubber ? rubber.gameIndex : 0
    this.isGameOver = rubber ? rubber.isGameOver : false
    this.bidId = rubber ? rubber.bidHistory.length : 0
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
      contractBidHistory: this.getContractBidHistory(),
      isGameOver: this.isGameOver
    }
  }

  sumbitBid(bid: IContractBid) {
    if (this.isGameOver) {
      return this
    }

    const bidContext = this.createBidContext(bid)

    // bidding team went under
    if (bid.tricksMade < 0) {
      return this.calculatePentalyPoints(bidContext)
    }
    // bid was made or made over tricks
    return this.calculateSuccessfulBidPoints(bidContext)
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

  calculatePentalyPoints(bidContext: Bid) {
    const contractBid = bidContext.contractBid
    const underTricks = Math.abs(contractBid.tricksMade)
    let bidScore = {
      id: bidContext.id
    }

    const bidInfo = `${contractBid.suit} ${contractBid.contractTricks}`
    let scoreDescription = ''
    if (!bidContext.isBidDoubledOrRedoubled) {
      const penaltyPointsAbove =
        underTricks * (UNDERTRICK_BASE_VALUE * bidContext.vulnerableMultiplier)
      scoreDescription = `(${bidInfo}) ${contractBid.team} went down ${underTricks}(s) scoring ${penaltyPointsAbove} points above for the other team`
      bidContext.dummyTeam.scoreAbove.push({
        ...bidScore,
        scoreDescription,
        score: penaltyPointsAbove
      })
      return this
    }

    // bid was doubled
    let penaltyPoints = 0
    const lookupList = bidContext.isBiddingTeamVulnerable
      ? UNDERTRICK_DOUBLED_VULNERABLE_LOOKUP
      : UNDERTRICK_DOUBLED_LOOKUP

    for (let i = 0; i < underTricks; i++) {
      const lookupIndex = i > lookupList.length - 1 ? lookupList.length - 1 : i
      penaltyPoints += lookupList[lookupIndex]
    }
    scoreDescription = `(${bidInfo}) ${contractBid.team} went down ${underTricks}(s) scoring ${penaltyPoints} points above for the other team`
    bidContext.dummyTeam.scoreAbove.push({
      ...bidScore,
      scoreDescription,
      score: penaltyPoints
    })

    return this
  }

  calculateSuccessfulBidPoints(bidContext: Bid) {
    const contractBid = bidContext.contractBid
    const noTrumpBonus = contractBid.suit === SUIT.NO_TRUMP ? 10 : 0
    const scoreBelow =
      bidContext.pointsPerTrick * contractBid.contractTricks + noTrumpBonus
    let bidScore = {
      id: bidContext.id
    }
    const bidInfo = `${contractBid.suit} ${contractBid.contractTricks}`
    let scoreDescription = `(${bidInfo}) Bid of ${
      contractBid.contractTricks + contractBid.suit
    } was made scoring ${scoreBelow} below the line \n`
    bidContext.biddingTeam.scoreBelow[this.gameIndex].push({
      ...bidScore,
      scoreDescription,
      score: scoreBelow
    })

    if (contractBid.tricksMade > 0) {
      const overTrickPoints =
        bidContext.pointsPerOverTrick * contractBid.tricksMade
      scoreDescription = `(${bidInfo}) ${contractBid.tricksMade} trick(s) made over the contract, scoring ${overTrickPoints} above the line \n`
      bidContext.biddingTeam.scoreAbove.push({
        ...bidScore,
        scoreDescription,
        score: overTrickPoints
      })
    }
    if (bidContext.isSmallSlamBid || bidContext.isGrandSlamBid) {
      const slamVulnerableMultiplier = this.vulnerableTeams.includes(
        contractBid.team
      )
        ? 1.5
        : 1
      const slamBonus = bidContext.isSmallSlamBid
        ? SS_BONUS_BASE_VALUE
        : GS_BONUS_BASE_VALUE
      const totalSlamBonus = slamBonus * slamVulnerableMultiplier
      scoreDescription = `(${bidInfo}) This bid earned a slam bonus of ${totalSlamBonus} \n`
      bidContext.biddingTeam.scoreAbove.push({
        ...bidScore,
        scoreDescription,
        score: totalSlamBonus
      })
    }

    if (contractBid.honorsWe) {
      scoreDescription = `(${bidInfo}) Team WE had honors worth ${contractBid.honorsWe} points \n`
      this.teamWe.scoreAbove.push({
        ...bidScore,
        scoreDescription,
        score: contractBid.honorsWe
      })
    }
    if (contractBid.honorsThey) {
      scoreDescription = `(${bidInfo}) Team THEY had honors worth ${contractBid.honorsThey} points \n`
      this.teamThey.scoreAbove.push({
        ...bidScore,
        scoreDescription,
        score: contractBid.honorsThey
      })
    }
    if (bidContext.isBidDoubledOrRedoubled) {
      const doubledBidInsultBonus =
        DOUBLED_BASE_VALUE * (bidContext.bidMultiplier / 2)
      scoreDescription = `(${bidInfo}) ${doubledBidInsultBonus} insult points are added for making a doubled bid`
      bidContext.biddingTeam.scoreAbove.push({
        ...bidScore,
        scoreDescription,
        score: doubledBidInsultBonus
      })
    }

    if (this.isGameWin(bidContext.biddingTeam.scoreBelow[this.gameIndex])) {
      this.teamWe.scoreBelow.push([])
      this.teamThey.scoreBelow.push([])
      this.gameIndex++
      this.isGameOver = this.vulnerableTeams.includes(contractBid.team)
      this.isGameOver && this.finalizeGame(bidContext.biddingTeam)
      !this.isGameOver && this.vulnerableTeams.push(contractBid.team)
    }
    return this
  }

  finalizeGame(biddingTeam: RubberTeam) {
    const slowRubber =
      this.vulnerableTeams.includes(TEAM.WE) &&
      this.vulnerableTeams.includes(TEAM.THEY)

    const rubberBonus = slowRubber ? SLOW_RUBBER_BONUS : FAST_RUBBER_BONUS
    const scoreDescription = `${rubberBonus} is awarded for winning a ${
      slowRubber ? 'slow' : 'fast'
    } rubber`

    biddingTeam.scoreAbove.push({
      id: this.bidId,
      scoreDescription,
      score: rubberBonus
    })
    this.teamWe.scoreBelow[this.gameIndex].push({
      id: -1,
      scoreDescription: '',
      score: this.teamWe.getTotalScore()
    })
    this.teamThey.scoreBelow[this.gameIndex].push({
      id: -1,
      scoreDescription: '',
      score: this.teamThey.getTotalScore()
    })
  }

  isGameWin(bids: IBidScore[]) {
    return (
      bids.map((bid) => bid.score).reduce((sum, num) => sum + num, 0) >= 100
    )
  }

  jumpToGameState(bids: IContractBid[]) {
    this.resetRubber()
    for (const bid of bids) {
      this.sumbitBid(bid)
    }
    return this
  }

  getContractBidHistory() {
    return this.bidHistory.map(bid => bid.contractBid)
  }

  deleteBid(bidId: number) {
    const newContractBidHistory = this.bidHistory.filter(bid => bid.id !== bidId).map(bid => bid.contractBid)
    return this.jumpToGameState(newContractBidHistory)
  }

  getContractBidById(bidId: number) {
    return this.getContractBidHistory()[bidId]
  }

  editBid(bidId: number, bid: IContractBid) {
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
