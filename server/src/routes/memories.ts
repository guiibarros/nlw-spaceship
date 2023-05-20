import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return {
      memories: memories.map((memory) => {
        return {
          id: memory.id,
          coverUrl: memory.coverUrl,
          excerpt:
            memory.content.length >= 115
              ? memory.content.substring(0, 115).concat('...')
              : memory.content,
          createdAt: memory.createdAt,
        }
      }),
    }
  })

  app.get('/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return {
      memory,
    }
  })

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '69cfee7c-7e52-4ef8-bd49-58eafc8f5fc6',
      },
    })

    return reply.code(201).send({
      memory,
    })
  })

  app.put('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.update({
      data: {
        content,
        coverUrl,
        isPublic,
      },
      where: {
        id,
      },
    })

    return reply.code(204).send({
      memory,
    })
  })

  app.delete('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })

    return reply.code(204).send()
  })
}
