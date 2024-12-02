class RubberTeam {
  scoreAbove: number[]
  scoreBelow: number[][]

  constructor() {
    this.scoreAbove = []
    this.scoreBelow = [[]]
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
