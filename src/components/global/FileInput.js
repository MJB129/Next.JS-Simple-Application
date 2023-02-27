const FileInput = ({ id, onChange }) => {
  return (
    <input
      className="w-full bg-[#fdfdfd] border-[1px] border-gray-300 rounded-md focus:outline-none text-gray-400 placeholder-gray-200 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:mr-4 cursor-pointer"
      id={id}
      type="file"
      onChange={onChange}
    />
  )
}

export default FileInput
