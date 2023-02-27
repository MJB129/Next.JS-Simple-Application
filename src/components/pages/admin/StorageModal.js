import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { XIcon } from '@heroicons/react/outline'

import { Button, Input, Select } from '@/components/global'
import { centerModalStyle } from '@/utils/styles'
import { defaultStorageTypes } from '@/constants'

const StorageModal = ({ isOpen, info, onClose, onSave }) => {
  const [data, setData] = useState({})
  const [name, setName] = useState('')
  const [types, setTypes] = useState([])
  const [type, setType] = useState(null)
  const [options, setOptions] = useState([])
  const [error, setError] = useState({})

  useEffect(() => {
    if (info) {
      const items = defaultStorageTypes.map(s => ({
        label: s.type,
        value: s.value,
      }))
      setTypes(items)
      setType(info.type)
      setName(info.name)

      // load other data
    }
  }, [info])

  useEffect(() => {
    // load type
    if (type) {
      const item = defaultStorageTypes.find(s => s.type === type)
      setOptions(item.options)
      if (type === info.type) {
        setData(info.options)
      } else {
        setData({})
      }
    }
  }, [type])

  const handleSubmit = () => {
    let errObj = null
    if (!name) {
      errObj = {
        ...errObj,
        name: `Name is required!`,
      }
    }
    options.forEach(opt => {
      if (!data[opt]) {
        errObj = {
          ...errObj,
          [opt]: `${opt} is required!`,
        }
      }
    })
    if (errObj) {
      setError(errObj)
      return
    }
    onSave({
      type,
      name,
      options: {
        ...data,
      },
    })
  }

  const updateData = (key, val) => {
    setError({})
    const updated = { ...data }
    updated[key] = val
    setData(updated)
  }

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Storage Modal"
      ariaHideApp={false}
      style={centerModalStyle}>
      <div className="pt-6 pb-4">
        <div className="flex justify-between px-6">
          <h5 className="text-lg text-gray-700">
            {info?.id ? 'Edit Info' : 'Add Storage'}
          </h5>
          <XIcon
            className="h-6 text-gray-700 cursor-pointer hover:opacity-75 duration-300"
            onClick={onClose}
          />
        </div>
        <hr className="my-2" />
        <div className="flex flex-col gap-4 px-8 py-4">
          <div>
            <p className="text-gray-500">Type</p>
            <Select
              id="storage-type-list"
              options={types}
              value={type}
              onSelect={v => {
                setType(v)
              }}
            />
          </div>
          <div>
            <p className="text-gray-500">Name</p>
            <Input
              type="text"
              value={name || ''}
              onChange={v => {
                setError({})
                setName(v)
              }}
            />
            {error.name ? (
              <p className="text-xs text-red-500 ml-2">{error.name}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, idx) => (
              <div key={`storage-opt-${idx}`}>
                <p className="text-gray-500">{opt}</p>
                <Input
                  type="text"
                  value={data[opt] || ''}
                  onChange={v => updateData(opt, v)}
                />
                {error[opt] ? (
                  <p className="text-xs text-red-500 ml-2">{error[opt]}</p>
                ) : null}
              </div>
            ))}
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

export default StorageModal
