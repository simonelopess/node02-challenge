import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'


export async function dailyRoutes(app: FastifyInstance) {
    app.post('/user', async (request, reply) => {
        const userBodySchema = z.object({
            name: z.string(),
        }) 

        const { name } = userBodySchema.parse(request.body);

        await knex('user').insert({
            id: randomUUID(), 
            name,
        })

        return reply.status(201).send()
    })
}