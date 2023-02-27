import { useState, useEffect } from 'react'

const Select = ({ id, value, options, customClass = 'w-full', onSelect }) => {
  const [data, setData] = useState(value)

  useEffect(() => {
    setData(value)
  }, [value])

  return (
    <select
      className={`h-10 rounded-lg bg-white px-4 border-gray-300 ${customClass}`}
      id={id}
      value={data}
      onChange={e => onSelect(e.target.value)}>
      {options.map((o, idx) => (
        <option key={`${id}-${idx}`} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export default Select
