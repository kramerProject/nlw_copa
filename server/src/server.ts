import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import ShortUniqueId from 'short-unique-id'


const prisma = new PrismaClient({
    log: ['query'],
})


async function boostrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })


    fastify.get('/pools/count',  async () => {
        const pools = await prisma.pool.count()
        return {count: pools}
    })

    fastify.get('/users/count',  async () => {
        const users = await prisma.user.count()
        return {count: users}
    })

    fastify.get('/guesses/count',  async () => {
        const guesses = await prisma.guess.count()
        return {count: guesses}
    })

    fastify.post('/pools',  async (req, res) => {
        const createPoolBody = z.object({
            title: z.string(),
        })

        const generate = new ShortUniqueId({length: 6})
        const code = String(generate()).toUpperCase()

        const { title } = createPoolBody.parse(req.body)
        await prisma.pool.create({
            data: {
                title,
                code
            }
        })
        return res.status(201).send({ code })
    })

    await fastify.listen({port: 3333})
}

boostrap()