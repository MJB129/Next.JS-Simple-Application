import { useAxios } from '@/lib/axios'
import { getCookie } from './cookie'

export const useAPI = () => {
  const { axios } = useAxios()
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const getData = async (path, requireAuh = false, ctx = null) => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      let token = null
      if (requireAuh) {
        token = getCookie('auth_token', ctx)
      }
      const { authAxios } = useAxios(token)
      const getAPI = token ? authAxios.get(path) : axios.get(path)
      getAPI
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          if (err && err.response) {
            if (err.response.status === 401) {
              console.log(err.response.data)
            }
            reject(err.response.data.error)
          } else {
            reject('Server error! Try again after few minutes please!')
          }
        })
    })
  }

  const postData = async (path, data) => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      const token = getCookie('auth_token')
      const { authAxios } = useAxios(token)

      authAxios
        .post(path, data)
        .then(res => {
          if (res && (res.status === 200 || res.status === 201)) {
            resolve(res.data)
          } else {
            reject('Server error! Try again after few mintues please!')
          }
        })
        .catch(err => {
          if (err && err.response) {
            if (err.response.status === 401) {
              console.log(err.response.data)
            }
            reject(err.response.data.error)
          } else {
            reject('Server error! Try again after few minutes please!')
          }
        })
    })
  }

  const postFormData = async (path, data, options = null) => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      const token = getCookie('auth_token')
      const { authAxios } = useAxios(token)

      authAxios
        .post(path, data, {
          ...options,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          if (res && (res.status === 200 || res.status === 201)) {
            resolve(res.data)
          } else {
            reject('Server error! Try again after few mintues please!')
          }
        })
        .catch(err => {
          if (err && err.response) {
            if (err.response.status === 401) {
              console.log(err.response.data)
            }
            reject(err.response.data.error)
          } else {
            reject('Server error! Try again after few minutes please!')
          }
        })
    })
  }

  const putData = async (path, data) => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      const token = getCookie('auth_token')
      const { authAxios } = useAxios(token)

      authAxios
        .put(path, data)
        .then(res => {
          if (res && (res.status === 200 || res.status === 204)) {
            resolve(res.data)
          } else {
            reject('Server error! Try again after few mintues please!')
          }
        })
        .catch(err => {
          if (err && err.response) {
            if (err.response.status === 401) {
              console.log(err.response.data)
            }
            reject(err.response.data.error)
          } else {
            reject('Server error! Try again after few minutes please!')
          }
        })
    })
  }

  const deleteData = async path => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      const token = getCookie('auth_token')
      const { authAxios } = useAxios(token)
      authAxios
        .delete(path)
        .then(res => {
          if (res && (res.status === 200 || res.status === 204)) {
            resolve(true)
          } else {
            reject('Server error! Try again after few minutes please!')
          }
        })
        .catch(err => {
          if (err && err.response) {
            if (err.response.status === 401) {
              console.log(err.response.data)
            }
            reject(err.response.data.error)
          } else {
            reject('Server error! Try again after few minutes please!')
          }
        })
    })
  }

  return {
    getData,
    postData,
    postFormData,
    putData,
    deleteData,
    csrf,
  }
}
