import { useRouter } from 'next/router'

import { withAuthSync } from '@/hooks/authSync'
import { ToastContainer } from 'react-toastify'
import { OverlayLoader } from '@/components/global'

import HomeLayout from './home'

const profile = ({ active, children, loading }) => {
  const router = useRouter()

  return (
    <HomeLayout title="User Profile">
      <div className="container mx-auto md:p-8 p-4">{children}</div>
        {loading && <OverlayLoader />}
    </HomeLayout>
  )
}
export default withAuthSync(profile)
