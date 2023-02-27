import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline'
import SweetAlert2 from 'react-sweetalert2'

import { AdminLayout } from '@/layout'
import { withAuthSync } from '@/hooks/authSync'
import { useAPI } from '@/hooks/api'
import { Button, Input } from '@/components/global'
import { UserModal } from '@/components/pages/admin'
import { dataTableCustomStyle } from '@/utils/styles'
import { toast } from 'react-toastify'

const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
})

const users = ({ users, status = true }) => {
  const [list, setList] = useState([])
  const [filtered, setFiltered] = useState([])
  const [columns, setColumns] = useState([])
  const [selected, setSelected] = useState({})
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    const { deleteData } = useAPI()
      setLoading(true)
      deleteData(`/api/admin/user/${selected.id}`)
        .then(r => {
            const { user } = r
          const idx = list.findIndex(itm => itm.id === selected.id)
          if (idx > -1) {
            const updated = JSON.parse(JSON.stringify(list))
            updated.splice(idx,1)
            setList(updated)
            toast.success('User is updated!')
          }
        })
        .catch(err => {
          toast.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
  }

  const handleCreate = () => {
    setSelected({ role: 'USER' })
    setShowEdit(true)
  }

  const filterUsers = () => {
    if (search !== '') {
      const items = list.filter(v =>
        v.email.toLowerCase().includes(search.toLowerCase()),
      )
      setFiltered(items)
    } else {
      setFiltered(list)
    }
  }

  const handleSave = (info, pwd) => {
    if (selected.id) {
      // update
      const { putData } = useAPI()
      setLoading(true)
      putData(`/api/admin/user/${selected.id}`, {
        ...info,
        password: pwd,
      })
        .then(r => {
          const { user } = r
          const idx = list.findIndex(itm => itm.id === selected.id)
          if (idx > -1) {
            const updated = JSON.parse(JSON.stringify(list))
            updated[idx] = user
            setList(updated)
            toast.success('User is updated!')
          }
          setShowEdit(false)
        })
        .catch(err => {
          toast.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      // create user
      const { postData } = useAPI()
      setLoading(true)
      postData('/api/admin/user', {
        ...info,
        password: pwd,
      })
        .then(r => {
          const { user } = r
          const updated = JSON.parse(JSON.stringify(list))
          updated = [...updated, user]
          setList(updated)
          toast.success('User is created!')
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

  useEffect(() => {
    const c = [
      {
        name: '#',
        selector: (_, index) => `${index + 1}`,
        center: true,
        width: '50px',
      },
      {
        name: 'Id',
        selector: row => <span className="font-bold">{row.id}</span>,
        center: true,
        hide: 'sm',
        width: '100px',
      },
      {
        name: 'Email',
        selector: row => row.email,
      },
      {
        name: 'Name',
        selector: row => `${row.first_name} ${row.last_name}`,
        hide: 'sm',
      },
      {
        name: 'Role',
        selector: row => row.role,
        hide: 'sm',
      },
      {
        name: 'Created',
        selector: row => new Date(row.created_at).toLocaleDateString(),
        hide: 'sm',
      },
      {
        name: 'Action',
        selector: row => (
          <div className="flex items-center gap-2">
            <PencilAltIcon
              className="text-primary h-6 cursor-pointer hover:opacity-50 duration-300"
              onClick={() => {
                setSelected(row)
                setShowEdit(true)
              }}
            />
            <TrashIcon
              className="text-red-500 h-6 cursor-pointer hover:opacity-50 duration-300"
              onClick={() => {
                if (row.role !== 'ADMIN') {
                  setSelected(row)
                  setShowDelete(true)
                } else {
                  toast.warning('You cannot delete ADMIN account!')
                }
              }}
            />
          </div>
        ),
        width: '100px',
      },
    ]
    setColumns(c)
  }, [])

  useEffect(() => {
    setList(users)
  }, [users])

  useEffect(() => {
    filterUsers()
  }, [list, search])

  return (
    <AdminLayout active="Users" title={'Users'} loading={loading}>
      {status === false ? (
        <h5 className="mt-10 text-center text-lg">
          You have no permission to this page!
        </h5>
      ) : (
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Users</h2>
            <div className="flex gap-2">
              <div className="flex max-w-[250px]">
                <Input
                  type="search"
                  placeholder="Search by name..."
                  value={search}
                  onChange={v => setSearch(v)}
                />
              </div>
              <Button variant="primary" size="sm" onClick={handleCreate}>
                Create
              </Button>
            </div>
          </div>
          <hr className="my-2" />
          <DataTable
            columns={columns}
            noDataComponent={
              <p className="text-center p-3 mb-0">No users yet!</p>
            }
            data={filtered}
            customStyles={dataTableCustomStyle}
            pagination
            striped
          />
          {showEdit && (
            <UserModal
              isOpen={showEdit}
              user={selected}
              onClose={() => setShowEdit(false)}
              onSave={handleSave}
            />
          )}
          {showDelete && (
            <SweetAlert2
              show={showDelete}
              title="Are you sure?"
              icon="warning"
              text="All videos created by this user will be removed too!"
              showCancelButton={true}
              confirmButtonText="Remove it!"
              onConfirm={() => handleDelete()}
              onResolve={() => setShowDelete(false)}
            />
          )}
        </div>
      )}
    </AdminLayout>
  )
}

users.getInitialProps = async ctx => {
  const { getData } = useAPI()
  try {
    const { users } = await getData('/api/admin/users', true, ctx)
    return {
      users,
    }
  } catch (err) {
    return {
      users: [],
      status: false,
    }
  }
}

export default withAuthSync(users)
