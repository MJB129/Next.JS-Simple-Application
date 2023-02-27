import { useState } from 'react'

import { ProfileLayout } from '@/layout'
import { useAPI } from '@/hooks/api'
import { toast } from 'react-toastify'


const password = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})

  const handleSave = () => {
    const { postData } = useAPI()
      setLoading(true)
      postData('/api/User/Password/Change', data)
        .then(r => {
            console.log(r)
            if(r.success == "true"){
                toast.success(r.message)
            }else{
                if(r.array == "true"){
                    let res = JSON.parse(r.message);
                    res = Object.values(res);
					console.log(res);
                    for(let x = 0;x < res.length;x++){
                        toast.error(res[x][0]);
                    }
                }else{
                    toast.error(r.message)
                }
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
    <ProfileLayout active="password" loading={loading}>
      <div className="flex flex-col max-w-[500px] mx-auto">
        <h4 className="font-bold text-lg border-b-[1px] border-gray-200 py-2">
          Change Password
        </h4>
        <div className="w-full py-4 px-3">
          <p className="ml-1">Current Password</p>
          <input
            type="password"
            className="w-full bg-[#fdfdfd] border-[1px] border-gray-200 rounded-md p-3"
            value={data?.current}
            placeholder="Current Password"
            onChange={e =>
              setData({
                ...data,
                current: e.target.value,
              })
            }
          />
          <p className="ml-1 mt-4">New Password</p>
          <input
            type="password"
            className="w-full bg-[#fdfdfd] border-[1px] border-gray-200 rounded-md p-3"
            value={data?.password}
            placeholder="New Password"
            onChange={e =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
          />
          <p className="ml-1 mt-4">Confirm Password</p>
          <input
            type="password"
            className="w-full bg-[#fdfdfd] border-[1px] border-gray-200 rounded-md p-3"
            value={data?.confirm}
            placeholder="Confirm Password"
            onChange={e =>
              setData({
                ...data,
                password_confirmation: e.target.value,
              })
            }
          />
          <div className="mt-8">
            <span
              className="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center cursor-pointer hover:opacity-75"
              onClick={handleSave}>
              Save Changes
            </span>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}
export default password
