const OverlayLoader = () => {
  return (
    <div className="w-screen h-screen fixed top-0 bottom-0 left-0 right-0 z-[9999] bg-[#ffffffC1] flex items-center justify-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-14 w-14 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="#0071F9"
          strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="#0071F9"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  )
}

export default OverlayLoader
