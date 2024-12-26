import { useState, ChangeEvent, FormEvent } from 'react'
import { IContractBid, SUIT, TEAM } from '../../utils/Rubber/Rubber.types'
import ListSelect from '../ListSelect/ListSelect'
import './BidInput.css'
import TricksMadeInput from '../RangeInput/TricksMadeInput'

const initialBid: IContractBid = {
  team: TEAM.WE,
  contractTricks: 1,
  tricksMade: 0,
  suit: SUIT.CLUBS,
  doubledMultiplier: 1,
  honorsWe: 0,
  honorsThey: 0
}

const teamOptions = [
  { label: 'We', value: TEAM.WE },
  { label: 'They', value: TEAM.THEY }
]

const contractTrickOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 }
]

const suitOptions = [
  { label: '♣', value: SUIT.CLUBS },
  { label: '♦', value: SUIT.DIAMONDS, classStyle: 'red' },
  { label: '♥', value: SUIT.HEARTS, classStyle: 'red' },
  { label: '♠', value: SUIT.SPADES },
  { label: 'NT', value: SUIT.NO_TRUMP }
]

const doubledOptions = [
  { label: '-', value: 1 },
  { label: 'X', value: 2 },
  { label: 'XX', value: 4 }
]

const tricksMadeMin = -8
const tricksMadeMax = 6

interface BidInputProps {
  defaultBid?: IContractBid
  onSubmit: (bid: IContractBid) => void
}

const BidInput: React.FC<BidInputProps> = ({ defaultBid = initialBid, onSubmit }) => {
  const [bidData, setBidData] = useState<IContractBid>(defaultBid)

  const handleChange = (e: ChangeEvent<HTMLInputElement> | 'increment' | 'decrement') => {
    switch (e) {
      case 'increment':
        setBidData((prevData) => ({
          ...prevData,
          tricksMade:
            prevData.tricksMade < tricksMadeMax ? prevData.tricksMade + 1 : prevData.tricksMade
        }))
        break
      case 'decrement':
        setBidData((prevData) => ({
          ...prevData,
          tricksMade:
            prevData.tricksMade > tricksMadeMin ? prevData.tricksMade - 1 : prevData.tricksMade
        }))
        break
      default:
        const { name, value } = e.target
        const val = !isNaN(Number(value)) ? Number(value) : value

        setBidData((prevData) => ({
          ...prevData,
          [name]: val
        }))
        break
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(bidData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bid-container">
        <div className="bid-input">
          <ListSelect
            name="team"
            options={teamOptions}
            value={bidData.team}
            handleChange={handleChange}
          />
          <ListSelect
            name="contractTricks"
            options={contractTrickOptions}
            value={bidData.contractTricks}
            handleChange={handleChange}
          />
          <ListSelect
            name="suit"
            options={suitOptions}
            value={bidData.suit}
            handleChange={handleChange}
          />
          <ListSelect
            name="doubledMultiplier"
            options={doubledOptions}
            value={bidData.doubledMultiplier}
            handleChange={handleChange}
          />
        </div>
        <div className="bid-input">
          <TricksMadeInput
            min={-8}
            max={6}
            value={bidData.tricksMade}
            handleChange={handleChange}
          />
          <button className="submit" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default BidInput
