const LinkButton = ({ href, customClass, children }) => {
  return (
    <a
      href={href}
      className={`px-4 py-2 rounded-lg bg-primary text-white hover:opacity-75 duration-300 ${customClass}`}>
      {children}
    </a>
  )
}
export default LinkButton
