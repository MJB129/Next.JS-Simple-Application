import { useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { DotsVerticalIcon } from '@heroicons/react/solid'

const DotDropdown = ({ items, onSelect, instanceId, customClass }) => {
  const [showMenu, setShowMenu] = useState(false)
  const ref = useDetectClickOutside({ onTriggered: () => setShowMenu(false) })
  return (
    <div className="relative" id={instanceId}>
      <DotsVerticalIcon
        className={`h-6 text-white cursor-pointer hover:opacity-50 duration-300 ${customClass}`}
        onClick={() => setShowMenu(!showMenu)}
      />
      {showMenu && (
        <div ref={ref}>
          <ul className="absolute top-[24px] right-0 bg-gray-300 z-10 rounded-md py-2">
            {items.map((itm, idx) => (
              <li
                className="px-4 py-2 text-black hover:bg-blue-500 hover:text-white duration-300 cursor-pointer text-sm"
                onClick={() => {
                  setShowMenu(false)
                  onSelect(itm, idx)
                }}
                key={`dropdown-${instanceId}-${idx}`}>
                {itm}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DotDropdown
