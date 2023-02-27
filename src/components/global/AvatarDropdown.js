import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { useRouter } from 'next/router'

import { userAtom } from '@/state/users'
import {
  DatabaseIcon,
  KeyIcon,
  LogoutIcon,
  UserIcon,
} from '@heroicons/react/outline'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'

const AvatarDropdown = () => {
  const [mounted, setMounted] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [user, setUser] = useRecoilState(userAtom)

  const router = useRouter()

  const ref = useDetectClickOutside({ onTriggered: () => setShowMenu(false) })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    const { logout } = useAuth()
    logout().then(() => {
      setUser(null)
      router.replace('/')
    })
  }

  return (
    mounted && (
      <div className="relative" id="avatar-dropdown-wrapper">
        {user && (
          <div ref={ref}>
            <div
              id="avatar-dropdown"
              className="flex items-center cursor-pointer hover:opacity-75 text-primary"
              onClick={() => setShowMenu(!showMenu)}>
              <img
                src={
                  user?.avatar
                    ? `${process.env.backendUrl}/${user?.avatar}`
                    : `/assets/images/user.svg`
                }
                className="h-[36px] w-[36px] rounded-full cursor-pointer mr-2"
              />
              {user?.first_name}
            </div>
            {showMenu && (
              <ul className="py-4 bg-white absolute right-0 top-[45px] flex flex-col w-[200px] shadow-card z-[100] rounded-md">
                {user.role === 'ADMIN' ? (
                  <li className="px-4 hover:bg-zinc-200 cursor-pointer py-2">
                    <Link href="/admin">
                      <a className="flex items-center text-gray-700">
                        <DatabaseIcon className="h-4 mr-3" />
                        Admin Panel
                      </a>
                    </Link>
                  </li>
                ) : null}
                <li className="px-4 hover:bg-zinc-200 cursor-pointer py-2">
                  <Link href="/user/profile">
                    <a className="flex items-center text-gray-700">
                      <UserIcon className="h-4 mr-3" />
                      Edit Profile
                    </a>
                  </Link>
                </li>
                <li className="px-4 hover:bg-zinc-200 cursor-pointer py-2">
                  <Link href="/user/password">
                    <a className="flex items-center text-gray-700">
                      <KeyIcon className="h-4 mr-3" />
                      Change password
                    </a>
                  </Link>
                </li>
                <li
                  className="px-4 hover:bg-zinc-200 cursor-pointer py-2"
                  onClick={() => handleLogout()}>
                  <div className="flex items-center text-gray-700">
                    <LogoutIcon className="h-4 mr-3" />
                    Sign Out
                  </div>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    )
  )
}

export default AvatarDropdown
