import { useState } from 'react'
import { AuthLayout } from '@/layout'
import { Input } from '@/components/global'

const forgot = ({}) => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState({})

  const handleSubmit = () => {}

  return (
    <AuthLayout title="vedio - Forgot password">
      <div className="shadow-card bg-white px-8 py-12 md:px-12 w-full rounded-2xl">
        <h3 className="text-2xl">Forgot Password?</h3>
        <p className="mt-12">Email</p>
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={v => {
            setSubmitted(false)
            onChange(e.target.value)
          }}
        />
        <button
          type="button"
          className="mt-10 rounded-lg w-full bg-[#0022c1] text-white hover:opacity-75 py-3"
          onClick={handleSubmit}>
          Submit
        </button>
        <div className="mt-10 flex justify-center">
          <a href="/login" className="text-[#0022c1] hover:opacity-75">
            Back to login
          </a>
        </div>
        <div className="mt-4 flex justify-center">
          <a href="/register" className="text-[#0022c1] hover:opacity-75">
            Create new account
          </a>
        </div>
      </div>
    </AuthLayout>
  )
}

export default forgot
