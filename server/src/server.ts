import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { poolRoutes } from './routes/pool'
import { userRoutes } from './routes/user'
import { guessRoutes } from './routes/guess'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'

async function boostrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })

    await fastify.register(poolRoutes)
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(userRoutes)
    await fastify.register(guessRoutes)

    // Em produção precisa estar em variavel de ambiente
    await fastify.register(jwt, {
        secret: 'nlwcopa',
    })

    await fastify.listen({port: 3333, host: '0.0.0.0'})
}

boostrap()