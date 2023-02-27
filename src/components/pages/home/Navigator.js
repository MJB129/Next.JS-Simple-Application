import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'

import { userAtom } from '@/state/users'
import { AvatarDropdown } from '@/components/global'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'

const Navigator = () => {
  const [navbar, setNavbar] = useState(false)
  const [user, setUser] = useRecoilState(userAtom)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

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
    <nav className="bg-[#FAFBFF] border-gray-200 px-2 sm:px-4 py-2 z-[1000] w-full">
      {mounted && (
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/">
                <a className="flex items-center">
                  <img
                    src="/assets/images/logo-full.png"
                    className="mr-3 md:h-8 h-6"
                    alt="MeetinBlue Logo"
                  />
                </a>
              </Link>
            </li>
            {user ? (
              <>
                <li className="hidden md:flex items-center">
                  <Link href="/app/upload">
                    <a className="bg-primary text-white rounded-full py-2 px-4 hover:opacity-75 duration-300">
                      Create
                    </a>
                  </Link>
                </li>
                <li className="hidden md:flex items-center">
                  <Link href="/app/videos">
                    <a className="text-primary hover:opacity-75 duration-300">
                      Videos
                    </a>
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
          <button
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="meetinblue-nav"
            onClick={() => setNavbar(!navbar)}>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"></path>
            </svg>
          </button>
          <div
            className={`w-full md:block md:w-auto meetinblue-nav ${
              navbar ? 'block' : 'hidden'
            }`}
            id="meetinblue-nav">
            <ul className="flex flex-col p-3 mt-4 md:flex-row space-y-4 md:space-x-4 md:space-y-0 md:mt-0 md:text-sm md:font-medium">
              {user ? (
                <>
                  <li className="hidden md:flex items-cener">
                    <AvatarDropdown />
                  </li>
                  {user.role === 'ADMIN' ? (
                    <li className="flex md:hidden items-center">
                      <Link href="/admin">
                        <a className="text-primary hover:opacity-75">
                          Admin panel
                        </a>
                      </Link>
                    </li>
                  ) : null}
                  <li className="flex md:hidden items-center">
                    <Link href="/upload">
                      <a className="text-primary hover:opacity-75">Create</a>
                    </Link>
                  </li>
                  <li className="flex md:hidden items-center">
                    <Link href="/app/videos">
                      <a className="text-primary hover:opacity-75">Videos</a>
                    </Link>
                  </li>
                  <li className="flex md:hidden items-center">
                    <Link href="/user/profile">
                      <a className="text-primary hover:opacity-75">Profile</a>
                    </Link>
                  </li>
                  <li className="flex md:hidden items-center">
                    <Link href="/user/password">
                      <a className="text-primary hover:opacity-75">
                        Change password
                      </a>
                    </Link>
                  </li>
                  <li className="flex md:hidden items-center">
                    <div
                      className="text-primary hover:opacity-75"
                      onClick={() => handleLogout()}>
                      Sign Out
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <Link href="/login">
                      <a
                        className="w-[118px] h-[40px] bg-white text-primary border-[1px] border-primary rounded-[5px] flex items-center justify-center hover:text-white hover:bg-primary duration-300"
                        id="goto-login">
                        Login
                      </a>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link href="/register">
                      <a
                        className="w-[118px] h-[40px] text-white bg-gradient-primary hover:bg-gradient-primary-revert rounded-[5px] flex items-center justify-center hover:opacity-75 duration-300"
                        id="goto-signup">
                        Sign Up
                      </a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigator
