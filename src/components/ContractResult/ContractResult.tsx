import { CSSProperties } from 'react'
import CaretDown from '../../assets/CaretDown'
import CaretUp from '../../assets/CaretUp'
import Check from '../../assets/Check'
import './ContractResult.css'

interface ContractResultProps {
  value: number
  size?: number
  style?: CSSProperties
}

const ContractResult = ({ value, size, style }: ContractResultProps) => {
  return (
    <div className='contract-result' style={style}>
      {value === 0 ? (
        <Check color="green" size={size} />
      ) : value > 0 ? (
        <>
          <CaretUp color="green" size={size} />
          {value}
        </>
      ) : (
        <>
          <CaretDown color="red" size={size} />
          {Math.abs(value)}
        </>
      )}
    </div>
  )
}

export default ContractResult
