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
}

export default RubberTeam
