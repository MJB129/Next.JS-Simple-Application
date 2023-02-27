import Axios from 'axios'

export const useAxios = (token = null) => {
  const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    // withCredentials: true,
  })

  const authAxios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })

  return {
    axios,
    authAxios,
  }
}
