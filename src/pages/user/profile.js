import { useEffect, useState, useRef } from 'react'
import { useRecoilState } from 'recoil'
import Select from 'react-select'
import { useSetRecoilState } from 'recoil'

import { ProfileLayout } from '@/layout'
import { useAuth } from '@/hooks/auth'
import { userAtom } from '@/state/users'
import { Input } from '@/components/global'
import { useAPI } from '@/hooks/api'
import { toast } from 'react-toastify'
import { withAuthSync } from '@/hooks/authSync'

const profile = ({ profileInfo }) => {
const setUser = useSetRecoilState(userAtom)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})

  const uploadRef = useRef(null)

  useEffect(() => {
    setData(profileInfo)
  }, [profileInfo])

  const updateData = (key, value) => {
    const updated = { ...data }
    updated[key] = value
    setData(updated)
  }

  const handleUpload = () => {
    uploadRef.current.value = null
    uploadRef.current.click()
  }

  const handleChange = e => {
    const fileUploaded = e.target.files[0]
    // update avatar
    const { postFormData } = useAPI()

    setLoading(true)
    const formData = new FormData()
    formData.append('avatar', fileUploaded)
    postFormData('api/User/uploadAvatar', formData)
      .then(r => {
        if(r.success == 'true'){
            updateData('avatar',r.url)
            toast.success(r.message)
            setUser(r.user)
        }else{
            toast.error(r.message)
        }
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => setLoading(false))
  }


  const handleUpdate = () => {
    const { postData } = useAPI()
    setLoading(true)
    postData(`/api/User/Update/Profile`, data)
      .then(r => {
        if(r.success == 'true'){
            setUser(r.user)
            toast.success(r.message)
        }else{
            toast.error(r.message)
        }
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <ProfileLayout active="profile" loading={loading}>
      <div className="flex flex-col max-w-[800px] mx-auto">
        <h4 className="font-bold text-lg border-b-[1px] border-gray-200 py-2">
          User Profile
        </h4>
        <div className="w-full h-[250px] relative mt-6">
          <div className="w-full bg-primary h-[175px] rounded-lg"></div>
          <div className="absolute bottom-0 w-full flex justify-center h-[150px]">
            <div className="w-[130px] h-[130px] rounded-full bg-gray-200 border-4 border-white relative">
              <div className="w-full h-full overflow-hidden rounded-full">
                <img
                  src={
                    data?.avatar
                      ? `${process.env.backendUrl}/${data?.avatar}`
                      : '/assets/images/user.svg'
                  }
                  className="w-full h-full"
                />
              </div>
              <div
                className="absolute bg-white w-[40px] h-[40px] flex items-center justify-center cursor-pointer right-0 bottom-[10px] rounded-full hover:opacity-75"
                onClick={() => handleUpload()}>
                <img
                  src="/assets/icons/edit.svg"
                  className="h-[20px] ml-[8px]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex md:flex-row flex-col items-center mt-6">
          <div className="md:w-1/6 w-full ml-2">Name</div>
          <div className="md:w-5/6 w-full flex gap-4">
            <div className="w-full flex-1">
              <Input
                type="text"
                value={data?.first_name || ''}
                onChange={v => updateData('first_name', v)}
                placeholder="First name"
              />
            </div>
            <div className="w-full flex-1">
              <Input
                type="text"
                value={data?.last_name || ''}
                onChange={v => updateData('last_name', v)}
                placeholder="Last name"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row items-center mt-6">
          <div className="md:w-1/6 w-full ml-2">Email</div>
          <div className="md:w-5/6 w-full">
            <Input
              type="email"
              value={data?.email || ''}
              onChange={v => updateData('email', v)}
              placeholder="Email"
            />
          </div>
        </div>
        <div className="w-full flex justify-end mt-6">
          <span
            className="px-4 py-2 bg-primary text-white rounded-lg ml-4 flex items-center justify-center cursor-pointer hover:opacity-75"
            onClick={handleUpdate}>
            Save Changes
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          ref={uploadRef}
          onChange={handleChange}
        />
      </div>
    </ProfileLayout>
  )
}


profile.getInitialProps = async ctx => {
    const { getData } = useAPI()
    try {
      const { profileInfo } = await getData('/api/User/Current', true, ctx)
      return {
        profileInfo,
      }
    } catch (err) {
      return {
        profileInfo: [],
      }
    }
  }

  export default withAuthSync(profile)
