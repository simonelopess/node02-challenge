import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'


export async function dailyRoutes(app: FastifyInstance) {
    app.post('/meal', async (request, reply) => {
        const mealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            isFit: z.boolean()
        })

        const { name, description, isFit } = mealBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()
      
            reply.setCookie('sessionId', sessionId, {
              path: '/',
              maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            })
          }

        await knex('meal').insert({
            id: randomUUID(),
            name,
            description,
            isFit,
            session_id: sessionId
        })

        return reply.status(201).send()
    })

    app.get(
        '/meal',
        {
          preHandler: [checkSessionIdExists],
        },
        async (request) => {
          const { sessionId } = request.cookies
    
          const meal = await knex('meal')
            .where('session_id', sessionId)
            .select()
    
          return { meal }
        },
      )
    
      app.get(
        '/meal/metrics',
        {
          preHandler: [checkSessionIdExists],
        },
        async (request) => {
          const { sessionId } = request.cookies
    
          const quantifyMealsRegistered = await knex('meal')
            .where('session_id', sessionId)
            .count({meals: '*'}) 

            const quantifyMealsRegisteredInDiet = await knex('meal')
            .where('isFit', 1).andWhere('session_id', sessionId)
            .count({isFit: 'isFit'})
    
            const quantifyMealsRegisteredOutDiet = await knex('meal')
            .where('isFit', 0).andWhere('session_id', sessionId)
            .count({isFit: 'isFit'})

          return { 
            quantitiy: quantifyMealsRegistered[0].meals, 
            isFit: quantifyMealsRegisteredInDiet[0].isFit, 
            isNotFit:  quantifyMealsRegisteredOutDiet[0].isFit, 
          }
        },
      )

    app.get(
        '/meal/:id',
    {
        preHandler: [checkSessionIdExists],
    },
    async (request) => {
        const getMealsParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getMealsParamsSchema.parse(request.params)

        const { sessionId } = request.cookies

        const meals = await knex('meal')
        .where({
            session_id: sessionId,
            id, 
        })
        .first()

        return {
            meals,
        }
    })

    app.delete('/meal/:id', 
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const {id} = getMealsParamsSchema.parse(request.params)

      const { sessionId} = request.cookies

      const meals = await knex('meal')
      .where({
        session_id: sessionId,
        id, 
      })
      .del()

      return reply.status(201).send()
    })

    app.put('/meal/:id', {
      preHandler: [checkSessionIdExists]
    }, 
     async(request, reply)  => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const mealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isFit: z.boolean()
      })


      const {id} = getMealsParamsSchema.parse(request.params)
      const { name, description, isFit } = mealBodySchema.parse(request.body)

      const { sessionId} = request.cookies

      const meals = await knex('meal')
      .where({
          session_id: sessionId,
          id, 
      })
      .update({
        id,
        name, 
        description, 
        isFit,
        session_id: sessionId
      })

      return reply.send(201).send()
     }
    )
}