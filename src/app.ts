import fastify from 'fastify'
import { dailyRoutes } from './routes/daily-api'

import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(dailyRoutes)