import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useAPI } from '@/hooks/api'
import { withAuthSync } from '@/hooks/authSync'
import { HomeLayout } from '@/layout'
import { Button, Progressbar } from '@/components/global'
import useSWR from 'swr'
import { toast } from 'react-toastify'

const videoStatus = ({ video, status = true }) => {
  const [videoStatus, setVideoStatus] = useState(0)
  const [transcodes, setTranscodes] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { getData } = useAPI()

  const { data, error } = useSWR(
    videoStatus === 0 ? `/api/videos/transcodes/${video?.slug}` : null,
    url => getData(url, true).then(res => res),
    { refreshInterval: 100 },
  )

  useEffect(() => {
    if (!status) {
      router.replace('/app/videos')
    }
  }, [])

  useEffect(() => {
    if (video) {
      // setCompleted(true)
      setVideoStatus(video.is_transcoded)
    }
  }, [video])

  useEffect(() => {
    if (data) {
      if (data.video) {
        setVideoStatus(data.video.is_transcoded)
      }
      setTranscodes(data.transcodes)
    }
  }, [data])

  const handleRoute = () => {
    router.replace('/app/videos')
  }

  const handleRetry = () => {
    const { getData } = useAPI()
    setLoading(true)
    getData(`/api/videos/retry-transcode/${video.id}`, true)
      .then(() => {
        setVideoStatus(0)
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <HomeLayout title={video?.title || 'Video'} loading={loading}>
      <div className="flex flex-col w-full px-2 py-4">
        {video ? (
          <div>
            {videoStatus === 1 && (
              <div className="flex flex-col justify-center items-center gap-4 mt-20">
                <h5 className="text-2xl font-bold text-primary text-center">
                  Video is ready to play!!
                </h5>
                <Button variant="primary" onClick={handleRoute} size="sm">
                  Go to Videos
                </Button>
              </div>
            )}
            {videoStatus === 2 && (
              <div className="flex flex-col justify-center items-center gap-4 mt-20">
                <h5 className="text-2xl font-bold text-red-500 text-center">
                  Transcoding is failed, you can retry or create another one!
                </h5>
                <Button variant="primary" onClick={handleRetry} size="sm">
                  Retry transcode
                </Button>
              </div>
            )}
            {videoStatus === 0 && (
              <div className="flex flex-col max-w-[600px] mx-auto gap-4 mt-4">
                <h5 className="text-xl font-bold">
                  {video?.title} Video transcoding status...
                </h5>
                {transcodes.length === 0 ? (
                  <h5 className="text-gray-500">
                    Transcodes in queue, please wait for few minutes
                  </h5>
                ) : (
                  <>
                    {transcodes.map((t, idx) => (
                      <div
                        className="flex flex-col"
                        key={`video-resolutin-${idx}`}>
                        <h5 className="text-gray-500 font-medium">
                          Resolution {t.file_format}p video
                        </h5>
                        <Progressbar percent={t.progress} />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </HomeLayout>
  )
}

videoStatus.getInitialProps = async ctx => {
  const { query } = ctx
  const { getData } = useAPI()

  try {
    if (query && query.slug) {
      const { video } = await getData(
        `/api/videos/by-slug/${query.slug}`,
        true,
        ctx,
      )
      return {
        video,
      }
    }
  } catch (err) {
    return {
      video: {},
      status: false,
    }
  }
}
export default withAuthSync(videoStatus)
