import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { ArrowRight } from 'lucide-react'

import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'

dayjs.locale(ptBR)

interface Memory {
  id: string
  excerpt: string
  coverUrl: string
  createdAt: string
}

interface MemoriesResponse {
  memories: Array<Memory>
}

async function loadMemories() {
  const token = cookies().get('token')?.value

  const response = await api.get<MemoriesResponse>('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const { memories } = await loadMemories()

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => (
        <div key={memory.id} className="space-y-4">
          <time
            dateTime={memory.createdAt}
            className="-ml-8 flex items-center gap-2 text-xs text-gray-100 before:h-px before:w-5 before:bg-gray-50"
          >
            {dayjs(memory.createdAt).format('D [de] MMMM[,] YYYY')}
          </time>
          <Image
            className="aspect-video w-full rounded-lg object-cover"
            src={memory.coverUrl}
            alt="Cover image"
            width={500}
            height={280}
          />
          <p className="text-lg leading-relaxed text-gray-100">
            {memory.excerpt}
          </p>
          <Link
            href={`/memories/${memory.id}`}
            className="flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-gray-100"
          >
            Ler mais
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  )
}
