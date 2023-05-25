import { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useFocusEffect, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'

import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

interface Memory {
  id: string
  excerpt: string
  coverUrl: string
  createdAt: string
}

dayjs.locale(ptBR)

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([])

  const router = useRouter()
  const { top, bottom } = useSafeAreaInsets()

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      async function getMemories() {
        const token = await SecureStore.getItemAsync('token')

        const response = await api.get('/memories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (isActive) {
          setMemories(response.data.memories)
        }
      }

      getMemories()

      return () => {
        isActive = false
      }
    }, []),
  )

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: bottom,
        paddingTop: top,
      }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            activeOpacity={0.7}
            onPress={signOut}
          >
            <Icon name="log-out" size={16} color="#121212" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
              activeOpacity={0.7}
            >
              <Icon name="plus" size={16} color="#121212" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="my-6 space-y-10">
        {memories.map((memory) => (
          <View className="space-y-4" key={memory.id}>
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memory.createdAt).format('DD [de] MMMM[,] YYYY')}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                className="aspect-video w-full rounded-lg"
                source={{
                  uri: memory.coverUrl,
                }}
                alt="Memory image"
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href={`/memories/${memory.id}`} asChild>
                <TouchableOpacity
                  className="flex-row items-center gap-2"
                  activeOpacity={0.7}
                >
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9E9EA0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
