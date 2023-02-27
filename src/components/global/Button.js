const Button = ({ variant, customClass, onClick, size = 'md', children }) => {
  let innerClass = ''
  if (variant === 'primary') {
    innerClass =
      'bg-primary text-white border-[1px] border-primary hover:opacity-75'
  } else if (variant === 'primary-outline') {
    innerClass =
      'bg-transparent text-primary border-[1px] border-primary hover:bg-primary hover:text-white'
  } else if (variant === 'secondary') {
    innerClass =
      'bg-gray-400 text-white border-[1px] border-gray-400 hover:opacity-75 hover:opacity-75'
  } else if (variant === 'secondary-outline') {
    innerClass =
      'bg-transparent text-gray-700 border-[1px] border-gray-400 hover:opacity-75'
  } else if (variant === 'success') {
    innerClass =
      'bg-green-600 text-white border-[1px] border-green-600 hover:opacity-75'
  } else if (variant === 'success-outline') {
    innerClass =
      'bg-transparent text-green-600 border-[1px] border-green-600 hover:bg-green-600 hover:text-white'
  }

  let sizeClass = 'text-md px-4 py-2'
  if (size === 'sm') {
    sizeClass = 'text-sm px-4 py-1.5'
  }

  return (
    <span
      className={`${innerClass} rounded-lg cursor-pointer ${sizeClass} duration-200 text-center ${customClass} flex items-center justify-center duration-300`}
      onClick={onClick}>
      {children}
    </span>
  )
}

export default Button
