import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John',
            email: 'johm@gmail.com',
            avatarUrl: 'https://github.com/kramerProject.png',
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'Bol123',
            ownerId: user.id,
            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-02T14:03:53.201Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountruCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-03T14:03:53.201Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountruCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                }
            }
        }
    })

    
}