/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from '@/app/(payload)/admin/importMap'

type Args = {
  children: React.ReactNode
}

const serverFunctionHandler = async (args: {
  config: any
  importMap: any
  request: Request
}) => {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunctionHandler}
  >
    {children}
  </RootLayout>
)

export default Layout
