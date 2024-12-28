export const displayDoubledMultiplier = (multiplier: number) => {
  switch (multiplier) {
    case 2:
      return 'X'
    case 4:
      return 'XX'
    default:
      return ''
  }
}
