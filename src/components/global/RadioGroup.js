const RadioGroup = ({
  options,
  id,
  value,
  valueLabel = 'value',
  nameLabel = 'label',
  onChange,
}) => {
  return (
    <div className="flex" id={id}>
      {options.map((opt, idx) => (
        <div
          className="flex items-center mr-4 cursor-pointer"
          key={`id-${idx}`}
          onClick={() => onChange(opt)}>
          <input
            id={`${id}-opt-${idx}`}
            type="radio"
            checked={value && value[valueLabel] === opt[valueLabel]}
            onChange={() => onChange(opt)}
            name="inline-radio-group"
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-1"
          />
          <label
            htmlFor={`${id}-opt-${idx}`}
            className="ml-2 text-gray-600 cursor-pointer">
            {opt[nameLabel]}
          </label>
        </div>
      ))}
    </div>
  )
}
export default RadioGroup
