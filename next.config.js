const intercept = require('intercept-stdout')

function interceptStdout(text) {
  if (text.includes('Duplicate atom key')) {
    return ''
  }
  if (text.includes('Text content did not match')) {
    return ''
  }
  return text
}

if (process.env.NODE_ENV === 'development') {
  intercept(interceptStdout)
}

module.exports = {
  env: {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
    appName: process.env.NEXT_PUBLIC_APP_NAME,
  },
}
