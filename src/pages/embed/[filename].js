import Head from 'next/head'
import { useAPI } from '@/hooks/api'
import { Router } from 'next/router'
import videojs from 'video.js'

import { VideoJS } from '@/components/global'

import 'videojs-seek-buttons'
import { useEffect, useState } from 'react'
let loaded = false
const embedByName = ({ video, imas = [], error = false}) => {
  const [options, setOptions] = useState(null)
  const [permission, setPermission] = useState(true)


  useEffect(() => {
    if (video) {
        const videoElement = document.getElementById('hls-video_html5_api')
        if (videoElement) {
            videoElement.classList.add('vjs-fill')
        }
    loaded = true
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
        responsive: true,
        loadingSpinner: true,
        skipIntroTime: video.skip_intro_time,
        muted: video.stg_muted === 1,
        loop: video.stg_loop === 1,
        autoPause: video.stg_autopause === 1,
      })
      if (video.allow_hosts) {
        let hosts = [...video.allow_hosts.split(','), process.env.frontendUrl, 'localhost'];
		let hostsname = '';
		try{
			hostsname = window.parent.location.hostname;
		}catch(err){
			hostsname = new URL(document.referrer).hostname;
		}
		if (!hosts.includes(hostsname)) {
          setPermission(false)
        }
      }

    }
  }, [video])
  let videoScripts  = []
    if(video.custom_script == 'null' || video.custom_script == '' || video.custom_script == null || video.custom_script == undefined){
    videoScripts  = []
  }else{
    videoScripts  = JSON.parse(video.custom_script)
  }


  return (
    <>
      <Head>
        <title>{video?.title || 'Video'}</title>
        {videoScripts.map((scripts, idx) => (
	  	<script>{scripts.script.replace("<script>","").replace("</script>","")}</script>
        ))}

      </Head>
      <div className="w-full h-screen relative flex items-center justify-center bg-black">
        {loaded ? (
            <>
            {error ? (
                <h5 className="text-white text-2xl">Video is not exist!</h5>
            ) : (
            <>
                {video && options && permission ? (
                <VideoJS
                    options={options}
                    imas={imas}
                    preload={video?.stg_preload_configration}
                    isEmbed={true}
                    height="auto"
                />


                ) : (
                <h5 className="text-white text-2xl">
                    {video.permission_error_message}
                </h5>
                )}
            </>
            )}
            </>

        ) : (
            <h5 className="text-white text-2xl">Loading ...</h5>
        )}

      </div>

    </>
  )
}

embedByName.getInitialProps = async ctx => {
  const { query } = ctx
  const { getData } = useAPI()

  try {
    if (query && query.filename) {
      const { video, imas } = await getData(
        `/api/videos/by-filename/${query.filename}`,
      )
      return {
        video,
        imas,
      }
    } else {
      Router.replace('/not-found')
    }
  } catch (err) {
    console.log('err')
    console.log(err)
    return {
      video: {},
      imas: [],
      error: true,
    }
  }
}

export default embedByName
