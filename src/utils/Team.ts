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
}

export default RubberTeam
