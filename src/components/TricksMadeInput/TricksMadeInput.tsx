import { ChangeEvent, FC } from 'react'
import './TricksMadeInput.css'
import ContractResult from '../ContractResult/ContractResult'

interface TricksMadeInputProps {
  min: number
  max: number
  value: number
  name: string
  handleChange: (e: ChangeEvent<HTMLInputElement> | 'increment' | 'decrement') => void
}

const TricksMadeInput: FC<TricksMadeInputProps> = ({min, max, value, name, handleChange}) => {

  const getBackground = () => {
    // This assumes the min is < 0 and the max is > 0 to correctly find 0 for the center on percentage
    const totalTicks = Math.abs(min) + Math.abs(max)
    const percentage = (Number(value) + Math.abs(min)) / totalTicks * 100;
    const centerOnPercentage = Math.abs(min) / totalTicks * 100
    
    if (percentage < centerOnPercentage){
      return `linear-gradient(to right, #ffbaba ${percentage}%, red ${percentage}% ${centerOnPercentage}%, #a8dda9 ${centerOnPercentage}% 100%)`
    } else {
      return `linear-gradient(to right, #ffbaba ${centerOnPercentage}%, green ${centerOnPercentage}% ${percentage}%, #a8dda9 ${percentage}% 100%)`
    }
  };

  return (
    <div className='container'>
      <input className='tricks-made-range' type="range" id={name} name={name} min={min} max={max} onChange={handleChange} value={value} style={{ background: getBackground()}} />
      <span className='selection'><ContractResult value={value} /></span>
      <div className='col'>
        <button className='tricks-made-button' type='button' onClick={() => handleChange('increment')}>▲</button>
        <button className='tricks-made-button' type='button' onClick={() => handleChange('decrement')}>▼</button>
      </div>
    </div>
  )
}

export default TricksMadeInput
