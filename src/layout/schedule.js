import { OverlayLoader } from '@/components/global'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ScheduleLayout = ({ title, loading = false, children }) => {
  return (
    <>
      <Head>
        <title>MeetinBlue - {title}</title>
      </Head>
      <div className="min-w-screen min-h-screen bg-[#e4e4e4] relative py-4 md:py-16 flex flex-col items-center px-4 md:px-0">
        {children}
        <div className="mt-14 flex flex-col items-center">
          <p className="text-gray-600 text-center">
            Powered By<span className="text-primary ml-1">MeetinBlue</span>
          </p>
          <img src="/assets/images/logo-full.png" className="h-12 mt-6" />
        </div>
      </div>
      {loading && <OverlayLoader />}
      <footer></footer>
      <ToastContainer />
    </>
  )
}

export default ScheduleLayout
