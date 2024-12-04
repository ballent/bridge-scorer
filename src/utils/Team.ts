
interface IRubberTeamOptions {
  scoreAbove: number[]
  scoreBelow: number[][]
}

class RubberTeam {
  scoreAbove: number[]
  scoreBelow: number[][]

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
    const totalScoreAbove = this.scoreAbove.reduce((sum, num) => sum + num, 0)
    const totalScoreBelow = this.scoreBelow
      .flat()
      .reduce((sum, num) => sum + num, 0)
    return totalScoreAbove + totalScoreBelow
  }
}

export default RubberTeam
