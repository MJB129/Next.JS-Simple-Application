import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import SweetAlert2 from 'react-sweetalert2'

import { HomeLayout } from '@/layout'
import { withAuthSync } from '@/hooks/authSync'
import { useAPI } from '@/hooks/api'
import { Button, Input } from '@/components/global'
import {
  InformationCircleIcon,
  PencilAltIcon,
  TrashIcon,
} from '@heroicons/react/solid'
import { toast } from 'react-toastify'

import { dataTableCustomStyle } from '@/utils/styles'

const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
})

const videos = ({ videos = [] }) => {
  const [allVideos, setAllVideos] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [columns, setColumns] = useState([])
  const [showDelete, setShowDelete] = useState(false)
  const [activeRow, setActiveRow] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const renderCell = row => {
    return (
      <div className="flex flex-col gap-2 py-4">
        <h4 className="text-lg font-bold">{row.title}</h4>
        <p className="text-gray-700">
          Date:{' '}
          <span className="font-bold">
            {new Date(row.created_at).toUTCString()}
          </span>
        </p>
        <p className="text-gray-700">
          Video duration:{' '}
          <span className="font-bold">{row.video_duration}s</span>
        </p>
        <p className="text-gray-700">
          Upload duration:{' '}
          <span className="font-bold">{row.upload_duration}s</span>
        </p>
        <p className="text-gray-700">
          Status:{' '}
          {
            <>
              {row.is_transcoded === 0 && (
                <Link href={`/app/video/status/${row.slug}`} target="_blank">
                  <a>
                    <span className="bg-primary px-2 py-1 rounded-full text-white text-xs hover:opacity-75 duration-300">
                      In Progress (click to see progress)
                    </span>
                  </a>
                </Link>
              )}
              {row.is_transcoded === 1 && (
                <span className="bg-green-500 px-2 py-1 rounded-full text-white text-xs">
                  Transcoded
                </span>
              )}
              {row.is_transcoded === 2 && (
                <Link href={`/app/video/status/${row.slug}`} target="_blank">
                <a>
                  <span className="bg-yellow-500 px-2 py-1 rounded-full text-white text-xs hover:opacity-75 duration-300">
                    Failed (click to retry)
                  </span>
                </a>
              </Link>
              )}
            </>
          }
        </p>
      </div>
    )
  }

  const handleInfo = row => {
    router.push(`/app/video/info/${row.slug}`)
  }

  const handleEdit = row => {
    router.push(`/app/video/edit/${row.slug}`)
  }

  const handleDelete = () => {
    // delete row
    const { deleteData } = useAPI()
    setLoading(true)
    deleteData(`/api/videos/${activeRow.id}`)
      .then(r => {
        toast.success('Video is successfully removed!')
        const idx = allVideos.findIndex(v => v.id === activeRow.id)
        if (idx > -1) {
          let updated = JSON.parse(JSON.stringify(allVideos))
          updated.splice(idx, 1)
          setAllVideos(updated)
        }
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const filterVideos = () => {
    if (search !== '') {
      const items = allVideos.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()),
      )
      setFiltered(items)
    } else {
      setFiltered(allVideos)
    }
  }

  const getPosterPath = row => {
    if (row.is_transcoded === 1 && row.playback_prefix) {
      return `${row.playback_prefix}${row.poster}`
    } else {
      return `${process.env.backendUrl}${row.poster}`
    }
  }

  useEffect(() => {
    const c = [
      {
        name: '#',
        selector: (_, index) => `${index + 1}`,
        center: true,
        width: '50px',
      },
      {
        name: 'Video Id',
        selector: row => <span className="font-bold">{row.id}</span>,
        center: true,
        hide: 'sm',
        width: '100px',
      },
      {
        name: 'Poster',
        selector: row => (
          <div className="w-full bg-gray-500">
            <Link href={`/app/video/info/${row.slug}`}>
              <a>
                <img
                  src={getPosterPath(row)}
                  className="w-full object-contain h-[100px] w-[200px]"
                />
              </a>
            </Link>
          </div>
        ),
        width: '200px',
      },
      {
        name: 'Info',
        selector: row => renderCell(row),
      },
      {
        name: 'Action',
        selector: row => (
          <div className="flex items-center gap-2">
            <InformationCircleIcon
              className="text-cyan-500 h-6 cursor-pointer hover:opacity-50 duration-300"
              onClick={() => handleInfo(row)}
            />
            <PencilAltIcon
              className="text-primary h-6 cursor-pointer hover:opacity-50 duration-300"
              onClick={() => handleEdit(row)}
            />
            <TrashIcon
              className="text-red-500 h-6 cursor-pointer hover:opacity-50 duration-300"
              onClick={() => {
                setActiveRow(row)
                setShowDelete(true)
              }}
            />
          </div>
        ),
        width: '120px',
      },
    ]
    setColumns(c)
  }, [])

  useEffect(() => {
    setAllVideos(videos)
  }, [videos])

  useEffect(() => {
    filterVideos()
  }, [search, allVideos])

  const handleCreate = () => {
    router.push('/app/upload')
  }

  return (
    <HomeLayout title="Dashboard" loading={loading}>
      <div className="flex flex-col w-full h-full px-2 py-4">
        <div className="container mx-auto">
          <div className="flex justify-between">
            <h2 className="text-2xl">Your videos</h2>
            <div className="flex gap-2">
              <div className="flex max-w-[250px]">
                <Input
                  type="search"
                  placeholder="Search by title..."
                  value={search}
                  onChange={v => setSearch(v)}
                />
              </div>
              <Button variant="primary" size="md" onClick={handleCreate}>
                Create
              </Button>
            </div>
          </div>
          <hr className="my-2" />
          <DataTable
            columns={columns}
            noDataComponent={
              <p className="text-center p-3 mb-0">No videos yet!</p>
            }
            data={filtered}
            customStyles={dataTableCustomStyle}
            pagination
            striped
          />
        </div>
        {showDelete && (
          <SweetAlert2
            show={showDelete}
            title="Are you sure?"
            icon="warning"
            text="You cannot recover this video once after removed!"
            showCancelButton={true}
            confirmButtonText="Remove it!"
            onConfirm={() => handleDelete()}
            onResolve={() => setShowDelete(false)}
          />
        )}
      </div>
    </HomeLayout>
  )
}

videos.getInitialProps = async ctx => {
  const { getData } = useAPI()

  try {
    const { videos } = await getData('/api/videos', true, ctx)
    return {
      videos,
    }
  } catch (err) {
    return {
      videos: [],
    }
  }
}
export default withAuthSync(videos)
