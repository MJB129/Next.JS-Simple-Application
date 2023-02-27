import Head from 'next/head'
import { Navigator } from '@/components/pages/home'
import { ToastContainer } from 'react-toastify'
import { OverlayLoader } from '@/components/global'

const HomeLayout = ({ children, title, loading = false }) => {
  return (
    <>
      <Head>
        <title>{`${process.env.appName} - ${title}`}</title>
      </Head>
      <div className="min-h-screen min-w-screen bg-[#f5f5f5]">
        <Navigator />
        {children}
      </div>
      <ToastContainer />
      {loading && <OverlayLoader />}
      <footer></footer>
    </>
  )
}

export default HomeLayout
