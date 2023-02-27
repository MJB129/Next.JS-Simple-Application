import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { AuthLayout } from '@/layout'
import { withAuthSync } from '@/hooks/authSync'

import { useAuth } from '@/hooks/auth'
import { userAtom } from '@/state/users'
import { useSetRecoilState } from 'recoil'
import { Button, Input } from '@/components/global'

const register = ({}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const setUserState = useSetRecoilState(userAtom)

  const router = useRouter()

  useEffect(() => {
    if (router && router.query && router.query.email) {
      setEmail(router.query.email)
    }
  }, [router, router?.query])

  const handleSubmit = () => {
    const { register: funcRegister } = useAuth()
    setSubmitted(true)
    if (
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      password === '' ||
      confirm === '' ||
      password !== confirm
    ) {
      let err = {}
      if (firstName === '') {
        err.firstName = 'First name is required!'
      }
      if (lastName === '') {
        err.lastName = 'Last name is required!'
      }
      if (email === '') {
        err.email = 'Email is required!'
      }
      if (password === '') {
        err.password = 'Password is required!'
      }
      if (confirm === '') {
        err.confirm = 'Confirm is required!'
      }
      if (password !== '' && password !== confirm) {
        err.confirm = 'Password is not matched!'
      }
      toast.warning('Please correct the input!')
      setError(err)
      return
    }

    setLoading(true)
    setError(null)
    funcRegister({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    })
      .then(res => {
        // register completed
        toast.success('Your account is successfully created!')
        // go to register-step
        setUserState(res)
        setTimeout(() => {
          router.push('/register-step')
        }, 100)
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
        setSubmitted(false)
      })
  }

  const updateData = (key, v) => {
    setSubmitted(false)
    setError(null)
    if (key === 'firstName') {
      setFirstName(v)
    } else if (key === 'lastName') {
      setLastName(v)
    } else if (key === 'email') {
      setEmail(v)
    } else if (key === 'password') {
      setPassword(v)
    } else if (key === 'confirm') {
      setConfirm(v)
    }
  }

  return (
    <AuthLayout title="vedio - Register" loading={loading}>
      <div className="shadow-card bg-white px-8 py-12 md:px-12 w-full rounded-2xl">
        <h3 className="text-2xl">
          Sign Up With <span className="text-[#0022c1]">Vedoapp!</span>
        </h3>
        <div className="mt-12 flex gap-2">
          <div className="flex-1">
            <p className="text-sm mb-1 ml-1">First Name</p>
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={v => updateData('firstName', v)}
            />
            {submitted && error?.firstName && (
              <p className="text-red-500 text-sm">{error?.firstName}</p>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm mb-1 ml-1">Last Name</p>
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={v => updateData('lastName', v)}
            />
            {submitted && error?.lastName && (
              <p className="text-red-500 text-sm">{error?.lastName}</p>
            )}
          </div>
        </div>
        <p className="mt-6 text-sm mb-1 ml-1">Email</p>
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={v => updateData('email', v)}
        />
        {submitted && error?.email && (
          <p className="text-red-500 text-sm">{error?.email}</p>
        )}
        <p className="mt-6 text-sm ml-1 mb-1">Password</p>
        <Input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={v => updateData('password', v)}
        />
        {submitted && error?.password && (
          <p className="text-red-500 text-sm">{error?.password}</p>
        )}
        <p className="mt-6 text-sm ml-1 mb-1">Confirm Password</p>
        <Input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={v => updateData('confirm', v)}
        />
        {submitted && error?.confirm && (
          <p className="text-red-500 text-sm">{error?.confirm}</p>
        )}
        <div className="flex mt-8 w-full">
          <Button variant="primary" customClass="w-full" onClick={handleSubmit}>
            Sign Up
          </Button>
        </div>
        <div className="mt-8 flex justify-center items-center">
          <span className="mr-2 text-sm">Already have an account?</span>
          <a href="/login" className="text-[#0022c1] hover:opacity-75 text-sm">
            Sign In
          </a>
        </div>
      </div>
    </AuthLayout>
  )
}

export default withAuthSync(register)
