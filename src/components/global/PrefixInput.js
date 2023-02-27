const PrefixInput = ({ prefix, type, value, onChange }) => {
  return (
    <div className="flex rounded-lg border-[1px] border-gray-300 overflow-hidden h-10 shadow-white">
      <span className="px-6 h-full bg-[#ECF0FF] h-10 flex items-center text-gray-500 w-[100px]">
        {prefix}
      </span>
      <input
        type={type}
        className="flex-1 bg-white border-0 h-10 px-2"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

export default PrefixInput
