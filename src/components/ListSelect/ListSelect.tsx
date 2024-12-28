import { ChangeEvent, Fragment, useState } from 'react'
import './ListSelect.css'

interface ListSelectProps {
  name: string
  options: Array<SelectOption>
  value: string | number
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

interface SelectOption {
  label: string
  value: string | number
  classStyle?: string
}

const ListSelect = ({name, options, value, handleChange}: ListSelectProps) => {
  const [selected, setSelected] = useState<null | number>(options.map(element => element.value).indexOf(value))

  const handleSelection = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    setSelected(idx)
    handleChange(e)
  }

  return (
    <div className='select-container'>
      {options.map((element, idx) => {
        return (
          <Fragment key={`list-select-${idx}`}>
            <label htmlFor={name + element.label} className={`select-option ${selected === idx ? 'selected' : null} ${element.classStyle ? element.classStyle : null}`}>
              <input
                className={`select`}
                type="radio"
                id={name + element.label}
                name={name}
                value={element.value}
                onChange={e => handleSelection(e, idx)}
                // checked={}
              />{element.label}
            </label>
            {idx !== options.length - 1 && <div className='spacer'/>}
          </Fragment>
        )
      })}
    </div>
  )
}

export default ListSelect
