import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import SweetAlert2 from 'react-sweetalert2'

import { withAuthSync } from '@/hooks/authSync'
import { HomeLayout } from '@/layout'
import { useAPI } from '@/hooks/api'
import {
  Button,
  Checkbox,
  CommonCard,
  FileInput,
  Input,
  Select,
  Textarea,
} from '@/components/global'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/solid'

const preloads = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Auto',
    value: 'auto',
  },
  {
    label: 'Metadata',
    value: 'metadata',
  },
]

const videoEdit = ({ video, imas, status = true }) => {
  const [data, setData] = useState({})
  const [videoImas, setVideoImas] = useState([])
  const [videoScripts, setVideoScripts] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [showDelete, setShowDelete] = useState(false)
  const [showDeleteScript, setShowDeleteScript] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!status) {
      router.replace('/no-video')
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (video) {
      if(video.custom_script == 'null' || video.custom_script == ''  || video.custom_script == null){
        setVideoScripts([])
      }else{
        setVideoScripts(JSON.parse(video.custom_script))
		  video.scripts = JSON.parse(video.custom_script)
      }
	setData(video)
    }
  }, [video])
  useEffect(() => {
    setVideoImas(imas)
  }, [imas])

  const updateData = (key, val) => {
    const updated = { ...data }
    updated[key] = val
    setData(updated)
  }
	const load_scripts_to_date = () => {
		videoScripts.map((scripts, idx) => {
			  updateScript(idx,'script',scripts.script)
			})
	}
  const posterUrl = () => {
    return video.playback_prefix
      ? `${video.playback_prefix}${data?.poster}?updated=${Date.now()}`
      : `${process.env.backendUrl}${data?.poster}?updated=${Date.now()}`
  }

  const handlePoster = e => {
    const files = e.target.files
    // setPoster(files[0])
    // update
    const formData = new FormData()
    formData.append('poster', files[0])
    const { postFormData } = useAPI()
    setLoading(true)
    postFormData(`/api/videos/${video.id}/update-poster`, formData)
      .then(r => {
        const updated = { ...data }
        updated.poster = r
        setData(updated)
        toast.success('Thumbnail is updated!')
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSave = () => {
    // add validation
    let errObj = null
    if (!data?.title) {
      errObj = {
        ...errObj,
        title: `Title is required!`,
      }
    }
    if (!data?.description) {
      errObj = {
        ...errObj,
        description: `Description is required!`,
      }
    }
    if (errObj) {
      setError(errObj)
      return
    }
    const { putData } = useAPI()
    setLoading(true)
    putData(`/api/videos/${video.id}`, data)
      .then(r => {
        setData(r.video)
        if(r.video.custom_script == 'null' || r.video.custom_script == ''  ||r.video.custom_script == null){
            setVideoScripts([])
          }else{
            setVideoScripts(JSON.parse(r.video.custom_script))
			  	videoScripts.map((scripts, idx) => {
			  updateScript(idx,'script',scripts.script)
			})
          }
        toast.success('Video is successfully updated')
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handlePlay = () => {
    router.push(`/app/video/info/${video.slug}`)
  }

  const handleAddIma = () => {
    const updated = [...videoImas, { id: -1, time: 0, adsUrl: '' }]
    setVideoImas(updated)
  }
  const handleAddScript = () => {
    const updated = [...videoScripts, { id: -1, script: '' }]
    setVideoScripts(updated)
  }
  const updateIma = (idx, key, val) => {
    const updated = [...videoImas]
    updated[idx][key] = val
    setVideoImas(updated)
  }
  const updateScript = (idx, key, val) => {
    const updated = [...videoScripts]
    updated[idx][key] = val
    setVideoScripts(updated)
    updateData('scripts',updated)
  }
  const handleSaveIma = idx => {
    const item = videoImas[idx]
    if (item.time <= 0 || item.adsUrl === '') {
      toast.warning('Please correct the IMA options!')
      return
    }
    if (item.id === -1) {
      // create new
      const { postData } = useAPI()
      setLoading(true)
      postData(`/api/videoimas`, {
        time: item.time,
        adsUrl: item.adsUrl,
        video_id: video.id,
      })
        .then(r => {
          const updated = JSON.parse(JSON.stringify(videoImas))
          updated[idx] = r.ima
          setVideoImas(updated)
          toast.success('IMA is successfully created!')
        })
        .catch(err => {
          toast.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      // update IMA
      const { putData } = useAPI()
      setLoading(true)
      putData(`/api/videoimas/${item.id}`, {
        time: item.time,
        adsUrl: item.adsUrl,
      })
        .then(r => {
          const updated = JSON.parse(JSON.stringify(videoImas))
          updated[idx] = r.ima
          setVideoImas(updated)
          toast.success('IMA is successfully created!')
        })
        .catch(err => {
          toast.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleDeleteIma = idx => {
    const item = videoImas[idx]
    if (item.id === -1) {
      const updated = JSON.parse(JSON.stringify(videoImas))
      updated.splice(idx, 1)
      setVideoImas(updated)
    } else {
      // delete
      const { deleteData } = useAPI()
      setLoading(true)
      deleteData(`/api/videoimas/${item.id}`)
        .then(() => {
          toast.success('IMA is successfully removed!')
          const updated = JSON.parse(JSON.stringify(videoImas))
          updated.splice(idx, 1)
          setVideoImas(updated)
        })
        .catch(err => {
          toast.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }
  const handleDeleteScript = idx => {
    const updated = videoScripts
    updated.splice(idx, 1)
    setVideoScripts(updated)
  }

  return (
    <HomeLayout title={video?.title || 'Video'} loading={loading}>
      <div className="flex flex-col w-full px-2 py-4">
        <div className="container mx-auto">
          {video && mounted ? (
            <div className="w-full max-w-[800px] mx-auto">
              {video ? (
                <>
                  <CommonCard customClass="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between">
                        <h2 className="text-xl font-bold tex-primary">
                          Edit {video?.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={handlePlay}>
                            Play
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSave}>
                            Save
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Basic settings</h3>
                        <hr className="my-2" />
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col">
                            <p className="text-gray-500">Title *</p>
                            <Input
                              type="text"
                              value={data?.title || ''}
                              onChange={v => updateData('title', v)}
                              placeholder="Title"
                            />
                            {error?.title && (
                              <p className="text-sm text-red-500 ml-2">
                                {error.title}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-gray-500">Description *</p>
                            <Textarea
                              value={data?.description || ''}
                              onChange={v => updateData('description', v)}
                              placeholder="Your video description here..."
                            />
                            {error?.description && (
                              <p className="text-sm text-red-500 ml-2">
                                {error.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-gray-500">
                              Player Skip Intro Timer *
                            </p>
                            <Input
                              type="number"
                              value={data?.skip_intro_time || 0}
                              onChange={v => updateData('skip_intro_time', v)}
                              placeholder="Skip intro timer"
                            />
                            {error?.skip_intro_time ? (
                              <p className="text-sm text-red-500 ml-2">
                                {error.skip_intro_time}
                              </p>
                            ) : (
                              <p className="text-sm text-red-500 ml-2">
                                Add minimum 5 seconds
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Player Settings</h3>
                        <hr className="my-2" />
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <Checkbox
                                id="stg-autoplay"
                                value={data?.stg_autoplay}
                                onChange={v => updateData('stg_autoplay', v)}
                                label="Autoplay"
                              />
                              <Checkbox
                                id="std-muted"
                                value={data?.stg_muted}
                                onChange={v => updateData('stg_muted', v)}
                                label="Muted"
                              />
                              <Checkbox
                                id="stg-loop"
                                value={data?.stg_loop}
                                onChange={v => updateData('stg_loop', v)}
                                label="Loop"
                              />
                              <Checkbox
                                id="stg-autopause"
                                value={data?.stg_autopause}
                                onChange={v => updateData('stg_autopause', v)}
                                label="Autopause"
                              />
                            </div>
                            <div>
                              <p className="text-gray-500">
                                Preload configuration
                              </p>
                              <Select
                                id="stg-preload-configuration"
                                options={preloads}
                                onSelect={v =>
                                  updateData('stg_preload_configration', v)
                                }
                                value={data?.stg_preload_configration}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-gray-500">Allowed hosts *</p>
                            <Textarea
                              value={data?.allow_hosts || ''}
                              onChange={v => updateData('allow_hosts', v)}
                              placeholder="Add comma separated links; abc.com,google.com"
                            />
                            <p className="text-xs text-blue-500 ml-2">
                              * Add comma separated values: abc.com,google.com
                              <br />* If you leave empty then all hosts are
                              allowed
                            </p>
                            {error?.allow_hosts && (
                              <p className="text-sm text-red-500 ml-2">
                                {error.allow_hosts}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-gray-500">permission error message</p>
                            <Textarea
                              value={data?.permission_error_message || 'This host has no permission to play video!'}
                              onChange={v => updateData('permission_error_message', v)}
                              placeholder="permission error message"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Custom Settings</h3>
                        <hr className="my-2" />
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col">
                            <p className="text-gray-500">Custom thumbnail</p>
                            <div className="md:w-1/2 w-full">
                              <div className="bg-gray-500 border-2 border-gray-300 flex flex-col justify-center mb-1">
                                <img
                                  src={posterUrl()}
                                  className="h-[200px] object-container"
                                />
                              </div>
                              <FileInput
                                id="video-thumb"
                                onChange={handlePoster}
                              />
                              <p className="text-xs ml-2 text-blue-500">
                                *It will replace thumbnail immediately!
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">Custom Scripts</h3>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={handleAddScript}>
                            Add
                          </Button>
                        </div>
                        <hr className="mt-1 mb-3" />
                        <div className="flex flex-col gap-3">
                          {videoScripts.map((scripts, idx) => (
                            <div
                              className="border-2 border-blue-400 relative"
                              key={`video-ima-${idx}`}>


                                 <div className="absolute top-2 right-4">
                                <div className="flex gap-1">
                                  <TrashIcon
                                    className="h-5 text-red-500 cursor-pointer hover:opacity-75 duration-300"
                                    onClick={() => {
                                      setActiveIdx(idx)
                                      setShowDeleteScript(true)
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="pt-5 pb-8 px-4">
                                <div className="flex flex-col gap-2">


                                <div className="flex flex-col">
                                    <p className="text-gray-500">Custom Script Box {idx + 1}</p>
                                    <Textarea
                                    value={scripts.script}
                                    onChange={e => updateScript(idx, 'script', e)}
                                    placeholder="Custom script {idx + 1} here..."
                                    />
                                </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleSave}>
                          Save changes
                        </Button>
                      </div>
                    </div>
                  </CommonCard>
                  <CommonCard customClass="p-6 mt-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">Video Ads</h3>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={handleAddIma}>
                            Add
                          </Button>
                        </div>
                        <hr className="mt-1 mb-3" />
                        <div className="flex flex-col gap-3">
                          {videoImas.map((ima, idx) => (
                            <div
                              className="border-2 border-blue-400 relative"
                              key={`video-ima-${idx}`}>
                              <div className="absolute top-2 right-4">
                                <div className="flex gap-1">
                                  <CheckCircleIcon
                                    className="h-5 text-blue-500 cursor-pointer hover:opacity-75 duration-300"
                                    onClick={() => handleSaveIma(idx)}
                                  />
                                  <TrashIcon
                                    className="h-5 text-red-500 cursor-pointer hover:opacity-75 duration-300"
                                    onClick={() => {
                                      setActiveIdx(idx)
                                      setShowDelete(true)
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="pt-5 pb-8 px-4">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="md:w-[100px] w-[60px] md:text-md text-sm font-bold text-right">
                                      Time:{' '}
                                    </span>
                                    <div>
                                      <Input
                                        type="number"
                                        value={ima.time}
                                        onChange={v =>
                                          updateIma(idx, 'time', v)
                                        }
                                        customClass="w-[100px]"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="md:w-[100px] w-[60px] md:text-md text-sm font-bold text-right">
                                      AdsUrl:{' '}
                                    </span>
                                    <div className="flex-1">
                                      <Input
                                        type="url"
                                        value={ima.adsUrl}
                                        placeholder="Ads url...."
                                        onChange={v =>
                                          updateIma(idx, 'adsUrl', v)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={`absolute bottom-[5px] right-4 text-xs ${
                                    ima.id === -1
                                      ? 'text-red-400'
                                      : 'text-blue-400'
                                  }`}>
                                  {ima.id === -1 ? 'Unsaved' : 'Saved'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CommonCard>
                </>
              ) : null}
            </div>
          ) : null}
          {showDelete && (
            <SweetAlert2
              show={showDelete}
              title="Are you sure?"
              icon="warning"
              text="Do you want to delete this Ads?"
              showCancelButton={true}
              confirmButtonText="Remove it!"
              onConfirm={() => handleDeleteIma(activeIdx)}
              onResolve={() => setShowDelete(false)}
            />
          )}
          {showDeleteScript && (
            <SweetAlert2
              show={showDeleteScript}
              title="Are you sure?"
              icon="warning"
              text="Do you want to delete this Script?"
              showCancelButton={true}
              confirmButtonText="Remove it!"
              onConfirm={() => handleDeleteScript(activeIdx)}
              onResolve={() => setShowDeleteScript(false)}
            />
          )}
        </div>
      </div>
    </HomeLayout>
  )
}

videoEdit.getInitialProps = async ctx => {
  const { query } = ctx
  const { getData } = useAPI()
  try {
    if (query && query.slug) {
      const { video, imas } = await getData(
        `/api/videos/by-slug/${query.slug}/show`,
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
      status: false,
    }
  }
}

export default withAuthSync(videoEdit)
