import { ChangeEvent } from 'react'
import './TricksMadeInput.css'

interface TricksMadeInputProps {
  min: number
  max: number
  value: number
  handleChange: (e: ChangeEvent<HTMLInputElement> | 'increment' | 'decrement') => void
}

const TricksMadeInput = ({min, max, value, handleChange}: TricksMadeInputProps) => {
  return (
    <div className='container'>
      <input type="range" id="vol" name="vol" min={min} max={max} onChange={handleChange} value={value} />
      <span className='selection'>{value > 0 ? `+${value}` : value === 0 ? '=' : value}</span>
      <div className='col'>
        <button type='button' onClick={() => handleChange('increment')}>▲</button>
        <button type='button' onClick={() => handleChange('decrement')}>▼</button>
      </div>
    </div>
  )
}

export default TricksMadeInput
