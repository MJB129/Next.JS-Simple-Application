import { useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { HomeLayout } from '@/layout'
import { withAuthSync } from '@/hooks/authSync'
import { useAPI } from '@/hooks/api'
import { Progressbar } from '@/components/global'
import { toast } from 'react-toastify'
import { CreateVideo } from '@/components/pages/videos'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#75aae9',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border .24s ease-in-out',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

const upload = () => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [list, setList] = useState([])

  const { postFormData } = useAPI()

  const handleDrop = files => {
    let data = new FormData()
    data.append('file', files[0])

    const options = {
      onUploadProgress: progressEvent => {
        const { loaded, total } = progressEvent
        let percent = Math.floor((loaded * 100) / total)
        setUploadProgress(percent)
        // console.log(`uploaded progress : ${percent}%`)
      },
    }
    const dt = Date.now()
    setIsUploading(true)
    postFormData('/api/videos/file-upload', data, options)
      .then(r => {
        const dt1 = Date.now()
        const updated = [
          ...list,
          {
            realName: files[0].name,
            ...r,
            uploadDuration: (dt1 - dt) / 1000,
          },
        ]
        setList(updated)
      })
      .catch(err => {
        toast.error(`Error while uploading video, try other video again!`)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  const handleSuccess = fileName => {
    const updated = JSON.parse(JSON.stringify(list))
    const idx = updated.findIndex(item => item.fileName === fileName)
    if (idx > -1) {
      updated.splice(idx, 1)
      setList(updated)
    }
  }

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'video/*': [
        '.mp4',
        '.mkv',
        '.mov',
        '.fvl',
        '.flv',
        '.avi',
        '.wmv',
        '.mpg',
        '.mpeg',
        '.3gp',
        '.3g2',
        '.webm',
      ],
    },
    onDrop: handleDrop,
    noClick: isUploading,
    multiple: false,
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  )

  return (
    <HomeLayout title="Create Video" loading={false}>
      <div className="container py-4 md:py-8 mx-auto">
        <div className="w-full md:w-[600px] mx-auto">
          <h2 className="text-primary font-bold text-2xl mb-6">
            Upload your video
          </h2>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop your video here, or click to select video</p>
            {isUploading ? (
              <div className="mt-2 w-full">
                <Progressbar percent={uploadProgress} />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {list.map((l, idx) => (
              <CreateVideo
                realName={l.realName}
                fileName={l.fileName}
                filePath={l.filePath}
                uploadDuration={l.uploadDuration}
                key={`video-file-${idx}`}
                onSuccess={handleSuccess}
              />
            ))}
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default withAuthSync(upload)
