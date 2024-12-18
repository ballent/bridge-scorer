import { IBidScore } from './Rubber/Rubber.types'

interface IRubberTeamOptions {
  scoreAbove: IBidScore[]
  scoreBelow: IBidScore[][]
}

class RubberTeam {
  scoreAbove: IBidScore[]
  scoreBelow: IBidScore[][]

  constructor(teamOptions?: IRubberTeamOptions) {
    this.scoreAbove = teamOptions ? teamOptions.scoreAbove : []
    this.scoreBelow = teamOptions ? teamOptions.scoreBelow : [[]]
  }

  getScoreBelow() {
    return this.scoreBelow
  }

  getScoreAbove() {
    return this.scoreAbove
  }

  getTotalScore() {
    const totalScoreAbove = this.scoreAbove
      .map((bid) => bid.score)
      .reduce((sum, num) => sum + num, 0)
    const totalScoreBelow = this.scoreBelow
      .map((game) => game.map((bid) => bid.score))
      .flat()
      .reduce((sum, num) => sum + num, 0)
    return totalScoreAbove + totalScoreBelow
  }
}

export default RubberTeam
