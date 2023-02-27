import { useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { useAuth } from '@/hooks/auth'
import { useSetRecoilState } from 'recoil'
import { userAtom } from '@/state/users'

const verifyEmail = ({ info }) => {
  const setUser = useSetRecoilState(userAtom)

  return (
    <>
      <Head>
        <title>MeetinBlue - Verify Email</title>
      </Head>
      <div className="min-w-screen min-h-screen bg-[#f5f5f5] md:p-12 p-4">
        <div className="container mx-auto rounded-lg bg-white shadow-whiteCard p-8 h-auto">
          <h5 className="text-2xl text-center font-medium">Congratulation</h5>
          <p className="text-center text-lg mt-5">
            Your account is successfully activated!
          </p>
          <div className="text-center mt-5">
            <a
              href="/register-step"
              className="text-primary hover:opacity-50 duration-300">
              Go to dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

verifyEmail.getInitialProps = async ctx => {
  const { query, res, req } = ctx

  try {
    const { verify } = useAuth()
    console.log(query)
    if (!query.id || !query.hash) {
      if (res) {
        res.writeHead(307, { Location: '/error' })
        res.end()
      } else {
        Router.replace('/error')
      }
    } else {
      const path = `${query.id}/${query.hash}`
      const user = await verify(path)

      return {
        user,
      }
    }
  } catch (err) {
    if (res) {
      res.writeHead(307, { Location: '/error' })
      res.end()
    } else {
      Router.replace('/error')
    }
  }
}

export default verifyEmail
