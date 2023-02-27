import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { OverlayLoader } from '@/components/global'

const AuthLayout = ({ title, loading = false, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="min-w-screen min-h-screen bg-white relative py-4 md:py-16 flex items-center md:px-8 px-4">
        <img
          src="/assets/images/login/login-calendar.svg"
          className="absolute bottom-0 left-0 hidden md:block z-0"
        />
        <img
          src="/assets/images/login/login-quick.svg"
          className="absolute top-0 right-0 hidden md:block z-0"
        />
        <div className="container relative z-10 flex justify-center mx-auto md:flex-row flex-col gap-4">
          <div className="md:w-2/5 w-full flex justify-center md:items-baseline items-center flex-col mb-5">
            <a href="/">
              <img
                src="/assets/images/logo-full.png"
                className="md:h-20 h-12"
              />
            </a>
            <h2 className="text-[40px] text-bold text-[#0022c1] mt-10 hidden md:block">
              Keep your video safe
            </h2>
            <p className="text-lg text-gray-400 mt-4 hidden md:block">
              You can stream your video with safety, <br />
              No one can download your app!
            </p>
          </div>
          <div className="flex md:w-2/5 w-full items-center md:justify-end justify-center">
            {children}
          </div>
        </div>
      </div>
      {loading && <OverlayLoader />}
      <footer></footer>
      <ToastContainer />
    </>
  )
}

export default AuthLayout
