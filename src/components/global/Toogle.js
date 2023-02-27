const Toggle = ({ checked, onChange, label, id }) => {
  return (
    <label
      htmlFor={id}
      className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        id={id}
        className="sr-only peer"
        onChange={e => onChange(e.target.checked)}
      />
      <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 duration-300"></div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  )
}

export default Toggle
