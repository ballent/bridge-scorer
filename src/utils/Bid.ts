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
