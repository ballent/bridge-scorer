import RubberTeam from '../Team'

export interface IRubberGameState {
  scoresAbove: { teamWe: number[]; teamThey: number[] }
  scoresBelow: { teamWe: number[][]; teamThey: number[][] }
  bidHistory: IBid[]
  isGameOver: boolean
}

export interface IBidContext {
  bid: IBid
  bidMultiplier: number
  biddingTeamVulnerable: boolean
  isBidDoubledOrRedoubled: boolean
  vulnerableMultiplier: number
  pointsPerTrick: number
  biddingTeam: RubberTeam
  dummyTeam: RubberTeam
  pointsPerOverTrick: number
}

export enum TEAM {
  WE = 'W',
  THEY = 'T'
}

export enum SUIT {
  CLUBS = 'C',
  DIAMONDS = 'D',
  HEARTS = 'H',
  SPADES = 'S',
  NO_TRUMP = 'N'
}

export interface IBid {
  team: TEAM
  contractTricks: number
  tricksMade: number
  suit: SUIT
  isDoubled: boolean
  isRedoubled: boolean
}
