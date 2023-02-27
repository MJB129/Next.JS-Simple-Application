import cookie from 'js-cookie'

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, { expires: 1, path: '/' })
  }
}

export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, { expires: 1 })
  }
}

const getCookieFromServer = (key, req) => {
  let r = Object.prototype.hasOwnProperty.call(req, 'req') ? req.req : req
  let rawCookie = null
  if (r && r.headers && r.headers.cookie) {
    rawCookie = r.headers.cookie
      .split(';')
      .find(c => c.trim().startsWith(`${key}=`))
  }
  return rawCookie ? rawCookie.split('=')[1] : undefined
}

const getCookieFromBrowser = key => cookie.get(key)

export const getCookie = (key, req) =>
  process.browser || req === undefined
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req)
