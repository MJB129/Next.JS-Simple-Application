import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/layout'
import { useAPI } from '@/hooks/api'
import { withAuthSync } from '@/hooks/authSync'
import { Button, CommonCard, Input, RadioGroup } from '@/components/global'
import {
  BadgeCheckIcon,
  ClockIcon,
  InformationCircleIcon,
  UsersIcon,
  VideoCameraIcon,
} from '@heroicons/react/solid'
import { toast } from 'react-toastify'

const admin = ({ info, status }) => {
  const [defaultStorage, setDefaultStorage] = useState({})
  const [videoLimit, setVideoLimit] = useState(0)
  const [maxLimit, setMaxLimit] = useState(0)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (info && info.storages && info.setting) {
      const item = info.storages.find(s => s.id === info.setting.storage_id)
      if (item) {
        setDefaultStorage(item)
      } else {
        setDefaultStorage(info.storages[0])
      }
      setVideoLimit(info.setting.video_limit)
      setMaxLimit(info.setting.max_video_size)
    }
  }, [info])

  const handleSave = () => {
    const { postData } = useAPI()
    setLoading(true)
    postData(`/api/admin/setting`, {
      max_video_size: maxLimit,
      video_limit: videoLimit,
      storage_id: defaultStorage.id,
    })
      .then(() => {
        toast.success('Default configuration is updated!')
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AdminLayout active="Settings" title="Settings" loading={loading}>
      {status === false ? (
        <h5 className="mt-10 text-center text-lg">
          You have no permission to this page!
        </h5>
      ) : (
        <div className="w-full max-w-[800px] mx-auto">
          <div className="flex flex-col gap-4">
            <div className="grid md:grid-cols-3 grid-cols-12 gap-4">
              <CommonCard>
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <span className="bg-blue-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <UsersIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Total Users</p>
                      <p>{info.users}</p>
                    </div>
                  </div>
                </div>
              </CommonCard>
              <CommonCard>
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <span className="bg-cyan-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <VideoCameraIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Total Videos</p>
                      <p>{info.videos.count}</p>
                    </div>
                  </div>
                </div>
              </CommonCard>
              <CommonCard>
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <span className="bg-green-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <BadgeCheckIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Total Transcoded</p>
                      <p>{info.videos.transcoded}</p>
                    </div>
                  </div>
                </div>
              </CommonCard>
              <CommonCard>
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <span className="bg-yellow-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <InformationCircleIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Total Failed</p>
                      <p>{info.videos.failed}</p>
                    </div>
                  </div>
                </div>
              </CommonCard>
              <CommonCard>
                <div className="flex gap-4">
                  <div className="flex gap-4">
                    <span className="bg-pink-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <ClockIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>In Progress</p>
                      <p>{info.videos.progress}</p>
                    </div>
                  </div>
                </div>
              </CommonCard>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl text-gray-600 font-bold mt-4">
                Configurations
              </h3>
              <hr className="my-2" />
              <div className="flex flex-col gap-6 px-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    <h4 className="text-gray-600 text-lg font-medium">
                      Default storage
                    </h4>
                    <Link href="/admin/storages">
                      <a className="text-blue-500 hover:opacity-75 duration-300">
                        (Add more from here)
                      </a>
                    </Link>
                  </div>
                  <RadioGroup
                    options={info.storages}
                    valueLabel="type"
                    nameLabel="name"
                    value={defaultStorage}
                    onChange={v => {
                      setDefaultStorage(v)
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
                  <div className="flex flex-col">
                    <h4 className="text-gray-600 text-lg font-medium">
                      Maximum video counts for each user.
                    </h4>

                    <Input
                      type="number"
                      value={videoLimit}
                      onChange={v => setVideoLimit(v)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-gray-600 text-lg font-medium">
                      Maximum video size for one video. (MB)
                    </h4>
                    <Input
                      type="number"
                      value={maxLimit}
                      onChange={v => setMaxLimit(v)}
                    />
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSave}>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

admin.getInitialProps = async ctx => {
  const { getData } = useAPI()
  try {
    const info = await getData('/api/admin/load', true, ctx)
    return {
      info,
      status: true,
    }
  } catch (err) {
    return {
      info: {},
      status: false,
    }
  }
}

export default withAuthSync(admin)
