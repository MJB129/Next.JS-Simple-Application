import { useState } from 'react'
import {
  Button,
  CommonCard,
  FileInput,
  Input,
  Textarea,
} from '@/components/global'
import { useAPI } from '@/hooks/api'
import { toast } from 'react-toastify'

const CreateVideo = ({ realName, fileName, filePath, uploadDuration, onSuccess }) => {
  const [poster, setPoster] = useState(null)
  const [data, setData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePoster = e => {
    const files = e.target.files
    setPoster(files[0])
  }

  const handleSubmit = () => {
    let errObj = null
    if (!data.title) {
      errObj = {
        ...errObj,
        title: `Title is required!`,
      }
    }
    if (!data.description) {
      errObj = {
        ...errObj,
        description: `Description is required!`,
      }
    }
    if (errObj) {
      setError(errObj)
      return
    }
    // perform submit
    const formData = new FormData()
    formData.append('path', fileName)
    formData.append('name', filePath)
    formData.append('title', data.title)
    formData.append('uploadDuration', uploadDuration);
    formData.append('description', data.description)
    if (poster) {
      formData.append('poster', poster)
    }
    setLoading(true)
    const { postFormData } = useAPI()
    postFormData('/api/videos/create-video', formData)
      .then(r => {
        toast.success(`${data.title} Video is created!`)
        // reset everything
        setData({})
        setPoster(null)
        onSuccess(fileName)
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const updateData = (key, val) => {
    setError(null)
    let updated = { ...data }
    updated[key] = val
    setData(updated)
  }

  return (
    <CommonCard>
      <div className="flex flex-col gap-4">
        <h5 className="font-bold">File: {realName}</h5>
        <div className="flex flex-col">
          <label className="text-gray-500">Title *</label>
          <Input
            type="text"
            value={data?.title || ''}
            onChange={v => updateData('title', v)}
            placeholder="Title"
          />
          {error?.title && (
            <p className="text-sm text-red-500 ml-2">{error.title}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-500">Description *</label>
          <Textarea
            value={data?.description || ''}
            onChange={v => updateData('description', v)}
            placeholder="Your video description here..."
          />
          {error?.description && (
            <p className="text-sm text-red-500 ml-2">{error.description}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-gray-500">Poster (optional)</label>
          <FileInput id="video-thumb" onChange={handlePoster} />
        </div>
        <hr className="mt-2" />
        {loading ? (
          <div className="flex justify-end">
            <p className="text-sm text-blue-500">It will take few minutes...</p>
          </div>
        ) : null}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            display={loading}>
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Creating...' : 'Create Video'}
          </Button>
        </div>
      </div>
    </CommonCard>
  )
}

export default CreateVideo
