import Bid from '../Bid'
import RubberTeam from '../Team'

export interface IRubber {
  vulnerableTeams: TEAM[]
  teamWe: RubberTeam
  teamThey: RubberTeam
  bidHistory: Bid[]
  gameIndex: number
  isGameOver: boolean
}

export interface IRubberGameState {
  scoresAbove: { teamWe: IBidScore[]; teamThey: IBidScore[] }
  scoresBelow: { teamWe: IBidScore[][]; teamThey: IBidScore[][] }
  contractBidHistory: IContractBid[]
  isGameOver: boolean
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

export interface IContractBid {
  team: TEAM
  contractTricks: number
  tricksMade: number
  suit: SUIT
  isDoubled: boolean
  isRedoubled: boolean
  honorsWe: number
  honorsThey: number
}

export interface IBidScore {
  id: number
  score: number
  scoreDescription: string
}
