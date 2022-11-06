import { number, z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count',  async () => {
        const guesses = await prisma.guess.count()
        return {count: guesses}
    })

    fastify.post('/pools/:poolsId/games/:gameId/guesses', {
        onRequest: [authenticate]
    },
    async (request, reply) => {
        const createGuessParams = z.object({
            poolId: z.string(),
            gameId: z.string(),
        })

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),

        })

        const { poolId, gameId } = createGuessParams.parse(request.params)
        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)


        const participant = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.sub,
                }
            }
        })

        if (!participant) {
            return reply.status(400).send({
                message: "You are not allowed to create guess in this pool",
            })
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId
                }
            }
        })

        if (guess) {
            return reply.status(400).send({
                message: "Participant already made a guess",
            })
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            }
        })

        if (!game) {
            return reply.status(400).send({
                message: "Game not found",
            })
        }


        if (game.date < new Date()) {
            return reply.status(400).send({
                message: "You can not send guesses after the game",
            })
        }


        await prisma.guess.create({
            data: {
                firstTeamPoints,
                secondTeamPoints,
                gameId,
                participantId: participant.id,
            }
        })


        return reply.status(201).send()
    })
}