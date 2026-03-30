import { serve } from '@hono/node-server'
import { handleEndpoints } from 'payload'
import { loadEnv } from 'payload/node'
import config from './dev-config.js'

loadEnv()

const port = 3000

const server = serve({
  fetch: async (request) => {
    return handleEndpoints({
      config,
      request: request.clone(),
    })
  },
  port,
})

server.on('listening', () => {
  console.log(`Payload CMS dev server running at http://localhost:${port}/api`)
})
