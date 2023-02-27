import { Button, Input, Select } from '@/components/global'
import { centerModalStyle } from '@/utils/styles'
import { XIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import ReactModal from 'react-modal'

const roles = [
  {
    label: 'ADMIN',
    value: 'ADMIN',
  },
  {
    label: 'USER',
    value: 'USER',
  },
]

const UserModal = ({ isOpen, user, onClose, onSave }) => {
  const [data, setData] = useState(user)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)

  const updateData = (key, val) => {
    setError(null)
    const updated = { ...data }
    updated[key] = val
    setData(updated)
  }

  const handleSubmit = () => {
    let errObj = null
    if (!data?.email) {
      errObj = {
        ...errObj,
        email: 'Email is required',
      }
    }
    if (!data?.first_name) {
      errObj = {
        ...errObj,
        first_name: 'First Name is required!',
      }
    }
    if (!data?.last_name) {
      errObj = {
        ...errObj,
        last_name: 'Last Name is required!',
      }
    }
    if (!user.id && !password) {
      errObj = {
        ...errObj,
        password: 'Password is required!',
      }
    }
    if (password !== confirm) {
      errObj = {
        ...errObj,
        confirm: 'Password is not matched!',
      }
    }

    if (errObj) {
      setError(errObj)
      return
    }

    onSave(
      {
        ...data,
      },
      password,
    )
  }

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="User Modal"
      ariaHideApp={false}
      title={user.id ? 'Edit User' : 'Add User'}
      style={centerModalStyle}>
      <div className="pt-6 pb-4">
        <div className="flex justify-between px-6">
          <h5 className="text-lg text-gray-700">
            {user?.id ? 'Edit User' : 'Add User'}
          </h5>
          <XIcon
            className="h-6 text-gray-700 cursor-pointer hover:opacity-75 duration-300"
            onClick={onClose}
          />
        </div>
        <hr className="my-2" />
        <div className="flex flex-col gap-4 px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p className="text-gray-500">First Name *</p>
              <Input
                type="text"
                value={data?.first_name || ''}
                placeholder="First Name"
                onChange={v => updateData('first_name', v)}
              />
              {error?.first_name && (
                <p className="text-xs ml-2 text-red-500">{error.first_name}</p>
              )}
            </div>
            <div>
              <p className="text-gray-500">Last Name *</p>
              <Input
                type="text"
                value={data?.last_name || ''}
                placeholder="Last Name"
                onChange={v => updateData('last_name', v)}
              />
              {error?.last_name && (
                <p className="text-xs ml-2 text-red-500">{error.last_name}</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-500">Email *</p>
            <Input
              type="text"
              value={data?.email || ''}
              placeholder="Email..."
              onChange={v => updateData('email', v)}
            />
            {error?.email && (
              <p className="text-xs ml-2 text-red-500">{error.email}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500">Password</p>
            <Input
              type="password"
              value={password}
              placeholder="Password"
              onChange={v => {
                setError(null)
                setPassword(v)
              }}
            />
            {error?.password && (
              <p className="text-xs ml-2 text-red-500">{error.password}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Confirm Password</p>
            <Input
              type="password"
              value={confirm}
              placeholder="Confirm password"
              onChange={v => {
                setError(null)
                setConfirm(v)
              }}
            />
            {error?.confirm && (
              <p className="text-xs ml-2 text-red-500">{error.confirm}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <Select
              id="user-edit-role"
              value={data?.role}
              options={roles}
              onSelect={v => updateData('role', v)}
            />
          </div>
        </div>
        <hr className="my-2" />
        <div className="px-8 flex justify-end gap-3">
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </ReactModal>
  )
}

export default UserModal
