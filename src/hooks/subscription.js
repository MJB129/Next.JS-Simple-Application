import axios from '@/lib/axios'

export const useSubscription = () => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const subscriptionPlans = async () => {
    return new Promise(async (resolve, reject) => {
      await csrf()
      axios
        .get('/subscription-plans')
        .then(res => {
          resolve(res.data)
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
    subscriptionPlans,
  }
}
