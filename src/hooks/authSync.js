import React, { Component } from 'react'
import Router from 'next/router'
import { useAuth } from './auth'
import { correctRouteName } from '@/utils/helper'

const authRoutes = [
  '/login',
  '/register',
  '/password/reset',
  '/password/forget',
]

const redirectWithAuth = ctx => {
  const { authenticated } = useAuth()

  const { pathname, asPath, query, req, res } = ctx

  let route = null

  if (authenticated(ctx)) {
    if (authRoutes.includes(pathname)) {
      const { redirect } = query
      route = redirect ? correctRouteName(redirect) : '/'
    }
  } else if (!authRoutes.includes(pathname)) {
    const redirect = pathname === '/logout' ? null : encodeURIComponent(asPath)
    route = redirect ? `/login?redirect=${redirect}` : '/login'
  }

  if (route !== null) {
    if (req) {
      res.writeHead(302, { Location: route })
      res.end()
      return
    }

    Router.push(route)
  }
}

export const withAuthSync = WrappedComponent =>
  class extends Component {
    static async getInitialProps(ctx) {
      redirectWithAuth(ctx)

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
