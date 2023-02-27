const Input = ({
  type,
  value,
  placeholder,
  size = 'md',
  onChange,
  disabled = false,
  customClass = 'w-full',
}) => {
  return (
    <input
      type={type}
      className={`${customClass} bg-[#fdfdfd] border-[1px] border-gray-300 rounded-md px-4 placeholder-gray-200 ${
        size === 'lg' ? 'py-3' : 'py-2'
      }`}
      value={value}
      readOnly={disabled}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default Input
