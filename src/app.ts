import fastify from 'fastify'
import { dailyRoutes } from './routes/daily-api'

export const app = fastify()

app.register(dailyRoutes)