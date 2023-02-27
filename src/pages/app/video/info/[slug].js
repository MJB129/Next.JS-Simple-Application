import { useEffect, useState } from 'react'
import { Router } from 'next/router'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { withAuthSync } from '@/hooks/authSync'
import { HomeLayout } from '@/layout'
import { CommonCard, VideoJS } from '@/components/global'
import { useAPI } from '@/hooks/api'
import {
  ClockIcon,
  CloudUploadIcon,
  DatabaseIcon,
  DesktopComputerIcon,
  FilmIcon,
  VideoCameraIcon,
  PencilAltIcon,
} from '@heroicons/react/solid'

import { toast } from 'react-toastify'

const Prism = dynamic(() => import('react-syntax-highlighter'), {
  ssr: false,
})

const { atomDark } = dynamic(
  () => import('react-syntax-highlighter/dist/esm/styles/prism'),
  {
    ssr: false,
  },
)

const videoInfo = ({ video, imas = [], error = false }) => {
  const [options, setOptions] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (error) {
      router.replace('/no-video')
    }
  }, [])

  useEffect(() => {
    if (video) {
      let url_prefix = ''
      if (video.playback_prefix) {
        url_prefix = `${video.playback_prefix}/uploads/${video.user_id}/${video.file_name}`
      } else {
        url_prefix = `${process.env.backendUrl}/uploads/${video.user_id}/${video.file_name}`
      }
      setOptions({
        techOrder: ['html5'],
        autoplay: video?.stg_autoplay === 1,
        controlBar: {
          children: [
            'playToggle',
            'progressControl',
            'volumePanel',
            'volumeMenuButton',
            'customControlSpacer',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'qualitySelector',
            'pictureInPictureToggle',
            'fullscreenToggle',
          ],
        },
        html5: {
          nativeAudioTracks: false,
          nativeVideoTracks: false,
          nativeTextTracks: false,

        },
        poster: video.playback_prefix
          ? `${video.playback_prefix}${video.poster}`
          : `${process.env.backendUrl}${video.poster}`,
        height: 560,
        textTrackSettings: true,
        sources: {
          src: `${url_prefix}/${video.playback_url}`,
          type: 'application/x-mpegURL',
        },
        thumbnails: `${url_prefix}/preview_01.jpg`,
        skipIntroTime: video.skip_intro_time,
        muted: video.stg_muted === 1,
        loop: video.stg_loop === 1,
        autoPause: video.stg_autopause === 1,
      })
    }
  }, [video])

  const playbackUrl = `${process.env.frontendUrl}/video/${video.file_name}`
  const embedCode = `<iframe src="${process.env.frontendUrl}/embed/${video.file_name}" frameborder="0" allow="accelorometer;autoplay;encrypted-media;" allowfullscreen style="width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;z-index:99999;" />`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    toast.success('Embed code is copied to clipboard!')
  }

  return (
    <HomeLayout title={video?.title || 'Video'}>
      <div className="flex flex-col w-full px-2 py-4">
        <div className="container mx-auto">
          {video && options ? (
            <div className="flex flex-col gap-4">
              <VideoJS
                options={options}
                imas={imas}
                preload={video?.stg_preload_configration}
              />
              <CommonCard customClass="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-xl font-bold">{video?.title}</h4>
                    <Link href={`/app/video/edit/${video.slug}`}>
                      <a>
                        <PencilAltIcon className="h-6 text-cyan-400 cursor-pointer hover:opacity-50 duration-300" />
                      </a>
                    </Link>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    <h4 className="text-xl">{video?.description}</h4>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    <p className="text-gray-500">Created at: </p>
                    <p className="ml-2">
                      {new Date(video.created_at).toUTCString()}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    <p className="text-gray-500">Playback URL: </p>
                    <p className="ml-2">
                      <a
                        href={playbackUrl}
                        target="_blank"
                        className="text-xs bg-black text-white rounded-lg px-2 py-1 font-bold hover:opacity-75 duration-300">
                        {playbackUrl}
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                      <p className="text-gray-500">Embed Code: </p>
                      <span
                        className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg cursor-pointer hover:opacity-75 duration-300"
                        onClick={handleCopy}>
                        Click to Copy
                      </span>
                    </div>
                    <Prism
                      language="javascript"
                      style={atomDark}
                      customStyle={{ padding: '20px', borderRadius: '10px' }}
                      wrapLines={true}
                      wrapLongLines={true}>
                      {embedCode}
                    </Prism>
                  </div>
                </div>
              </CommonCard>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-green-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <FilmIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Video Duration</p>
                      <p>{video.video_duration}s</p>
                    </div>
                  </div>
                </CommonCard>
                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-red-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <CloudUploadIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Upload Duration</p>
                      <p>{video.upload_duration}s</p>
                    </div>
                  </div>
                </CommonCard>
                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-yellow-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <ClockIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Processing Time</p>
                      <p>{video.process_time}</p>
                    </div>
                  </div>
                </CommonCard>
                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-cyan-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <DatabaseIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Video FileSize</p>
                      <p>{video.original_filesize}</p>
                    </div>
                  </div>
                </CommonCard>

                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-blue-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <DesktopComputerIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Video Resolution</p>
                      <p>{video.original_resolution}</p>
                    </div>
                  </div>
                </CommonCard>

                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-rose-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <VideoCameraIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Original Codec</p>
                      <p>{video.original_video_codec}</p>
                    </div>
                  </div>
                </CommonCard>
                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-green-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <VideoCameraIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Original Bitrate</p>
                      <p>{video.original_bitrate}</p>
                    </div>
                  </div>
                </CommonCard>
                <CommonCard>
                  <div className="flex gap-4">
                    <span className="bg-yellow-500 flex items-center justify-center w-12 h-12 rounded-md">
                      <VideoCameraIcon className="h-8 text-white" />
                    </span>
                    <div>
                      <p>Original Video Type</p>
                      <p>{video.video_original_type}</p>
                    </div>
                  </div>
                </CommonCard>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </HomeLayout>
  )
}

videoInfo.getInitialProps = async ctx => {
  const { query } = ctx
  const { getData } = useAPI()

  try {
    if (query && query.slug) {
      const { video, imas } = await getData(
        `/api/videos/by-slug/${query.slug}`,
        true,
        ctx,
      )

      return {
        video,
        imas,
      }
    } else {
      Router.replace('/not-found')
    }
  } catch (err) {
    return {
      video: {},
      imas: [],
      error: true,
    }
  }
}

export default withAuthSync(videoInfo)
