import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'

import { AuthLayout } from '@/layout'
import { withAuthSync } from '@/hooks/authSync'
import { useAuth } from '@/hooks/auth'
import { correctRouteName } from '@/utils/helper'
import { userAtom } from '@/state/users'
import { Input, Button } from '@/components/global'

const login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState({})
  const setUser = useSetRecoilState(userAtom)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = () => {
    setSubmitted(true)

    if (email === '' || password === '') {
      let err = {}
      if (email === '') {
        err.email = 'Email is required!'
      }
      if (password === '') {
        err.password = 'Password is required!'
      }
      setError(err)
      return
    }
    setError({})

    const { login: funcLogin } = useAuth()
    setLoading(true)
    funcLogin({
      email,
      password,
      remember,
    })
      .then(r => {
        // set user info
        setUser(r)
        const { redirect } = router.query
        toast.success('You have been logged in successfully!')
        setTimeout(() => {
          router.replace(redirect ? correctRouteName(redirect) : '/app/videos')
        }, 200)
      })
      .catch(err => {
        // error.response as result
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleEmail = v => {
    setSubmitted(false)
    setEmail(v)
  }

  const handlePassword = v => {
    setSubmitted(false)
    setPassword(v)
  }

  return (
    <AuthLayout title="Vedio - Login" loading={loading}>
      <div className="shadow-card bg-white px-8 py-12 md:px-12 w-full rounded-2xl">
        <h3 className="text-2xl">Sign In</h3>
        <p className="mt-12">Email</p>
        <Input
          type="email"
          placeholder="Your email"
          value={email || ''}
          size="lg"
          onChange={handleEmail}
        />
        {submitted && error.email && (
          <p className="text-red-500 text-sm">{error.email}</p>
        )}
        <p className="mt-8">Password</p>
        <Input
          type="password"
          placeholder="Your password"
          value={password || ''}
          size="lg"
          onChange={handlePassword}
        />
        {submitted && error.password && (
          <p className="text-red-500 text-sm">{error.password}</p>
        )}
        <div className="mt-4 flex justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
              Remember Me
            </label>
          </div>
          <a
            href="/forgot-password"
            className="text-[#0022c1] hover:opacity-75">
            Forgot your password?
          </a>
        </div>
        <div className="mt-10 w-full flex">
          <Button variant="primary" customClass="w-full" onClick={handleSubmit}>
            Sign In
          </Button>
        </div>
        <div className="mt-10 flex justify-center">
          <span className="mr-2">New Here?</span>
          <a href="/register" className="text-[#0022c1] hover:opacity-75">
            Create new account
          </a>
        </div>
      </div>
    </AuthLayout>
  )
}

export default withAuthSync(login)
