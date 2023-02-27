const CommonCard = ({ children, customClass = 'p-4' }) => {
  return (
    <div
      className={`${customClass} w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700`}>
      {children}
    </div>
  )
}

export default CommonCard
