const Checkbox = ({ id, value, onChange, label }) => (
  <div className="flex items-center">
    <input
      checked={value || false}
      id={id}
      type="checkbox"
      value={value || false}
      onChange={e => onChange(e.target.checked)}
      className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
    />
    <label
      htmlFor={id}
      className="ml-2 font-medium text-gray-500 cursor-pointer">
      {label}
    </label>
  </div>
)

export default Checkbox
