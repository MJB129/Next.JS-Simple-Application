import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import { useInView } from 'react-intersection-observer'

import 'videojs-seek-buttons'
import 'videojs-contrib-quality-levels'
import 'videojs-sprite-thumbnails'
import 'videojs-hls-quality-selector'
import 'videojs-markers'
import 'videojs-contrib-ads'
import 'videojs-ima'
import '@/components/external/videojs-skip-intro'
const VideoJS = ({
  options,
  preload = 'none',
  isEmbed = false,
  imas = [],
  height = 560,
}) => {
  const playerRef = useRef(null)

  const { ref, inView, entry } = useInView({
    threshold: 0,
    trackVisibility: true,
    delay: 100,
  })

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.getElementById('hls-video')
      if (videoElement) {
        const SeekBar = videojs.getComponent('SeekBar')
        SeekBar.prototype.getPercent = function getPercent() {
          const time = this.player_.currentTime()
          const percent = time / this.player_.duration()
          return percent >= 1 ? 1 : percent
        }

        SeekBar.prototype.handleMouseMove = function handleMouseMove(event) {
          let newTime = this.calculateDistance(event) * this.player_.duration()
          if (newTime === this.player_.duration()) {
            newTime = newTime - 0.1
          }
          this.player_.currentTime(newTime)
          this.update()
        }
        const player = (playerRef.current = videojs(
          videoElement,
          {
            ...options,

            plugins: {
              spriteThumbnails: {
                interval: 2,
                url: options.thumbnails,
                width: 160,
                height: 90,
                downlink: 0,
              },
            },
          },
          () => {
            // player.spriteThumbnails({
            //   interval: 2,
            //   url: options.thumbnails,
            //   width: 160,
            //   height: 90,
            // })
            player.src(options.sources)
            player.hlsQualitySelector({
              displayCurrentQuality: false,
            })
            player.seekButtons({
              forward: 10,
              back: 10,
            })
            if (options.skipIntroTime > 0) {
              player.skipIntro({
                label: 'Skip Intro',
                skipTime: options.skipIntroTime,
              })
            }
            if (imas.length > 0) {
              player.ima({
                id: 'hls-video',
                adLabel: 'AD',
                adTagUrl: null,
                adsRenderingSettings: {
                  enablePreloading: true,
                },
                playAdAlways: true,
                autoplay: true,
              })
              player.markers({
                markerStyle: {
                  width: '4px',
                  'background-color': 'yellow',
                },
                markerTip: {
                  display: false,
                },
                onMarkerReached: function (mark, index) {
                  player.ima.changeAdTag(mark.adsUrl)
                  player.ima.requestAds()
                  player.markers.remove([index])
                },
                markers: imas,
              })
            }
            if (options.autoPause) {
            }
            if (options.autoplay) {
              player.play()
            }
          },
        ))
      }

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current
      // player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options])

  useEffect(() => {
    const player = playerRef.current
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  useEffect(() => {
    if (playerRef.current) {
      if (options.autoPause) {
        const player = playerRef.current
        if (inView) {
          player.play()
        } else {
          player.pause()
        }
      }
    }
  }, [inView])

  return (
    <div ref={ref}>
      <div data-vjs-player className="w-full">
        <video
          id="hls-video"
          x-webkit-airplay="allow"
          className={`video-js vjs-big-play-centered playsinline webkit-playsinline vjs-theme-forest ${
            isEmbed ? 'hls-vjs-embedc-player' : 'vjs-16-9'
          }`}
          controls
          preload={preload}
          height={height}
          crossOrigin="anonymous">
          <track
            kind="captions"
            src={'/assets/sample.vtt'}
            srcLang="en"
            label="English"
          />
        </video>
      </div>
    </div>
  )
}

export default VideoJS
