import { useAxios } from '@/lib/axios'
import { getCookie, removeCookie, setCookie } from './cookie'

export const useAuth = () => {
  const { axios } = useAxios()

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const authenticated = ctx => {
    const token = getCookie('auth_token', ctx)
    return token ? true : false
  }

  const login = async data => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      axios
        .post('/login', data)
        .then(res => {
          // save to cookie
          if (res && res.status === 200) {
            // login success
            const { data } = res
            setCookie('auth_token', data.token)
            resolve(data.user)
          } else {
            reject('Server error!Try again after few minutes please!')
          }
        })
        .catch(err => {
          let errmsg = 'Server error!Try again after few minutes please!'
          if (err && err.response) {
            if (err.response.data.message) {
              errmsg = err.response.data.message
            } else if (err.response.data.error) {
              errmsg = err.response.data.error
            }
          }
          reject(errmsg)
        })
    })
  }

  const logout = async () => {
    return new Promise(async resolve => {
      await csrf()
      const token = getCookie('auth_token')
      const { authAxios } = useAxios(token)
      authAxios
        .post('/logout')
        .then(res => {
          // remove cookie
          removeCookie('auth_token')
          resolve('')
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            removeCookie('auth_token')
            resolve('')
          } else {
            reject('Invalid login')
          }
        })
    })
  }

  const register = async data => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      axios
        .post('/register', data)
        .then(res => {
          if (res && res.status === 201) {
            const { data } = res
            setCookie('auth_token', data.token)
            resolve(data.user)
          } else {
            reject('Server error!Try again after few minutes please!')
          }
        })
        .catch(err => {
          if (err && err.response) {
            reject(err.response.data.error)
          } else {
            reject('Server error!Try again after few minutes please!')
          }
        })
    })
  }

  const step = async data => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      axios
        .post('/register-step', data)
        .then(res => {
          if (res && res.status === 200) {
            const { data } = res
            resolve(data.user)
          } else {
            reject('Server error!Try again after few minutes please!')
          }
        })
        .catch(err => {
          if (err && err.response) {
            reject(err.response.data.error)
          } else {
            reject('Server error!Try again after few minutes please!')
          }
        })
    })
  }

  const verify = async path => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      axios
        .get(`/verify-email/${path}`)
        .then(res => {
          // login
          const { data } = res
          setCookie('auth_token', data.token)
          resolve(data.user)
        })
        .catch(err => {
          if (err && err.response) {
            reject(err.response.data.error)
          } else {
            reject('Server error!Try again after few minutes please!')
          }
        })
    })
  }

  return {
    authenticated,
    login,
    register,
    logout,
    step,
    verify,
  }
}
