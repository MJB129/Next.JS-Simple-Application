const Textarea = ({
  value,
  placeholder,
  rows = 3,
  onChange,
  disabled = false,
}) => {
  return (
    <textarea
      className={`w-full bg-[#fdfdfd] border-[1px] border-gray-300 rounded-md px-4 placeholder-gray-200`}
      value={value || ''}
      rows={rows}
      readOnly={disabled}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default Textarea
