import { useState, ChangeEvent, FormEvent } from 'react'
import { IContractBid, SUIT, TEAM } from '../../utils/Rubber/Rubber.types'

const initialBid: IContractBid = {
  team: TEAM.WE,
  contractTricks: 1,
  tricksMade: 0,
  suit: SUIT.CLUBS,
  isDoubled: false,
  isRedoubled: false,
  honorsWe: 0,
  honorsThey: 0
}

const contractTrickOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' }
]

const tricksMadeOptions = [
  { value: -8, label: '-8' },
  { value: -7, label: '-7' },
  { value: -6, label: '-6' },
  { value: -5, label: '-5' },
  { value: -4, label: '-4' },
  { value: -3, label: '-3' },
  { value: -2, label: '-2' },
  { value: -1, label: '-1' },
  { value: 0, label: '=' },
  { value: 1, label: '+1' },
  { value: 2, label: '+2' },
  { value: 3, label: '+3' },
  { value: 4, label: '+4' },
  { value: 5, label: '+5' },
  { value: 6, label: '+6' }
]

interface BidInputProps {
  defaultBid?: IContractBid
  onSubmit: (bid: IContractBid) => void
}

const BidInput: React.FC<BidInputProps> = ({ defaultBid = initialBid, onSubmit }) => {
  const [bidData, setBidData] = useState<IContractBid>(defaultBid)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? e.target.checked : undefined
    const val = !isNaN(Number(value)) ? Number(value) : value

    setBidData((prevData) => ({
      ...prevData,
      [name]: checked !== undefined ? checked : val
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(bidData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="team">
          <input
            type="radio"
            id="team"
            name="team"
            value={TEAM.WE}
            onChange={handleChange}
            checked={bidData.team === TEAM.WE}
          />{' '}
          WE
        </label>
        <label>
          <input
            type="radio"
            id="team"
            name="team"
            value={TEAM.THEY}
            onChange={handleChange}
            checked={bidData.team === TEAM.THEY}
          />{' '}
          THEY
        </label>
      </div>

      <div>
        <label htmlFor="contractTricks">Contract tricks:</label>
        <select
          id="contractTricks"
          name="contractTricks"
          value={bidData?.contractTricks}
          onChange={handleChange}
          required
        >
          {contractTrickOptions.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
      </div>

      <div>
        <label htmlFor="suit">Suit:</label>
        <select
          id="suit"
          name="suit"
          value={bidData?.suit}
          onChange={handleChange}
        >
          <option value={SUIT.NO_TRUMP}>No Trump</option>
          <option value={SUIT.CLUBS}>Clubs</option>
          <option value={SUIT.DIAMONDS}>Diamonds</option>
          <option value={SUIT.HEARTS}>Hearts</option>
          <option value={SUIT.SPADES}>Spades</option>
        </select>
      </div>
      <div>
        <label htmlFor="tricksMade">Tricks Made:</label>
        <select
          id="tricksMade"
          name="tricksMade"
          value={bidData?.tricksMade}
          onChange={handleChange}
        >
          {tricksMadeOptions.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
      </div>

      <div>
        <label htmlFor="isDoubled">Doubled?</label>
        <input
          type="checkbox"
          id="isDoubled"
          name="isDoubled"
          key="isDoubled"
          checked={bidData?.isDoubled}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="isRedoubled">Redoubled?</label>
        <input
          type="checkbox"
          id="isRedoubled"
          name="isRedoubled"
          key="isRedoubled"
          checked={bidData?.isRedoubled}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="honorsWe">Honors we?</label>
        <select
          id="honorsWe"
          name="honorsWe"
          value={bidData?.honorsWe}
          onChange={handleChange}
        >
          <option value={0}>No honors</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
        </select>
      </div>

      <div>
        <label htmlFor="honorsThey">Honors they?</label>
        <select
          id="honorsThey"
          name="honorsThey"
          value={bidData?.honorsThey}
          onChange={handleChange}
        >
          <option value={0}>No honors</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default BidInput
