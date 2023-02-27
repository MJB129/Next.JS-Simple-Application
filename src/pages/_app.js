import 'tailwindcss/tailwind.css'
import '@/styles/home/home.css'
import '@/styles/app/app.css'
import 'video.js/dist/video-js.css'
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css'
import 'videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css'
import 'videojs-markers/dist/videojs.markers.css'
import 'videojs-ima/dist/videojs.ima.css'

import '@/styles/external/videojs-skip-intro.css'
import '@/styles/app/player.css'

import { RecoilRoot } from 'recoil'
import NextNProgressProps from 'nextjs-progressbar'

const App = ({ Component, pageProps }) => (
  <RecoilRoot>
    <NextNProgressProps color="#0071F9" stopDelayMs={200} height={3} />
    <Component {...pageProps} />
  </RecoilRoot>
)

export default App
