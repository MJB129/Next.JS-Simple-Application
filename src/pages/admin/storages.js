import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline'
import SweetAlert2 from 'react-sweetalert2'

import { AdminLayout } from '@/layout'
import { withAuthSync } from '@/hooks/authSync'
import { useAPI } from '@/hooks/api'
import { Button, CommonCard } from '@/components/global'
import { StorageModal } from '@/components/pages/admin'

const storages = ({ storages, defaultId, status = true }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (storages && storages.length > 0) {
      const items = storages.map(s => ({
        ...s,
        options: JSON.parse(s.options),
      }))
      setList(items)
    }
  }, [storages])

  const handleSave = v => {
    if (selected.id) {
      // update
      const { putData } = useAPI()
      putData(`/api/admin/storage/${selected.id}`, {
        type: v.type,
        name: v.name,
        options: JSON.stringify(v.options),
      })
        .then(r => {
          const { storage } = r
          const updated = JSON.parse(JSON.stringify(list))
          const idx = updated.findIndex(u => u.id === selected.id)
          if (idx > -1) {
            updated[idx] = {
              ...selected,
              type: v.type,
              name: v.name,
              options: JSON.stringify(v.options),
            }
          }
          setList(updated)
          setShowEdit(false)
        })
        .catch(err => toast.error(err))
        .finally(() => {
          setLoading(false)
        })
    } else {
      // create
      setLoading(true)
      const { postData } = useAPI()
      postData('/api/admin/storage', {
        type: v.type,
        name: v.name,
        options: JSON.stringify(v.options),
      })
        .then(r => {
          const { storage } = r
          const updated = JSON.parse(JSON.stringify(list))
          updated = [
            ...updated,
            {
              ...storage,
              options: JSON.parse(storage.options),
            },
          ]
          setList(updated)
          setShowEdit(false)
        })
        .catch(err => {
          toast.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleDelete = () => {
    const { deleteData } = useAPI()
    setLoading(true)
    deleteData(`/api/admin/storage/${selected.id}`)
      .then(() => {
        toast.success(`Storage - ${selected.name} is removed!`)
        const updated = JSON.parse(JSON.stringify(list))
        const idx = updated.findIndex(u => u.id === selected.id)
        if (idx > -1) {
          updated.splice(idx, 1)
          setList(updated)
        }
      })
      .catch(err => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AdminLayout active="Storages" title={'Storages'} loading={loading}>
      {status === false ? (
        <h5 className="mt-10 text-center text-lg">
          You have no permission to this page!
        </h5>
      ) : (
        <div className="w-full max-w-[600px] mx-auto">
          <div className="flex justify-between items-center">
            <h5 className="text-lg">External Storages</h5>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelected({ type: 'S3', options: {} })
                setShowEdit(true)
              }}>
              Add
            </Button>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col gap-2">
            {list.map((s, idx) => (
              <CommonCard key={`storage-card-${idx}`}>
                <div className="flex justify-between">
                  <h5 className="text-lg text-gray-600 font-bold">
                    {s.name}{' '}
                    {defaultId === s.id && (
                      <span className="text-gray-400">(Default)</span>
                    )}
                  </h5>
                  <div className="flex gap-2">
                    <PencilAltIcon
                      className="h-6 text-cyan-500 hover:opacity-50 duration-300 cursor-pointer"
                      onClick={() => {
                        setSelected(s)
                        setShowEdit(true)
                      }}
                    />
                    <TrashIcon
                      className="h-6 text-red-500 hover:opacity-50 duration-300 cursor-pointer"
                      onClick={() => {
                        setSelected(s)
                        setShowDelete(true)
                      }}
                    />
                  </div>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                  <h5 className="text-gray-500 mt-4">
                    Type :{' '}
                    <span className="text-gray-700 font-bold">{s.type}</span>
                  </h5>
                  {Object.keys(s.options).map(key => (
                    <h5
                      className="text-gray-500"
                      key={`storage-${idx}-option-${key}`}>
                      {key} :{' '}
                      <span className="text-gray-700 font-bold">
                        {s.options[key]}
                      </span>
                    </h5>
                  ))}
                </div>
              </CommonCard>
            ))}
          </div>

          {showEdit && (
            <StorageModal
              isOpen={showEdit}
              info={selected}
              onClose={() => setShowEdit(false)}
              onSave={handleSave}
            />
          )}

          {showDelete && (
            <SweetAlert2
              show={showDelete}
              title="Are you sure?"
              icon="warning"
              html="
                <h5 class='text-red-500'>
                  Are you going to delete this storage option?
                  <br />
                  Videos stored here will be lose too!
                </h5>
              "
              showCancelButton={true}
              onConfirm={() => handleDelete()}
              onResolve={() => setShowDelete(false)}
            />
          )}
        </div>
      )}
    </AdminLayout>
  )
}

storages.getInitialProps = async ctx => {
  const { getData } = useAPI()
  try {
    const { storages, defaultId } = await getData(
      '/api/admin/storages',
      true,
      ctx,
    )
    return {
      storages,
      defaultId,
    }
  } catch (err) {
    return {
      storages: [],
      defaultId: null,
      status: false,
    }
  }
}

export default withAuthSync(storages)
