import { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'

import {
  View,
  TouchableOpacity,
  Switch,
  Text,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const router = useRouter()

  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const { top, bottom } = useSafeAreaInsets()

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets.at(0)) {
        setPreview(result.assets.at(0).uri)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })

      coverUrl = uploadResponse.data.fileURL
    }

    await api.post(
      '/memories',
      {
        coverUrl,
        content,
        isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/memories')
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: bottom,
        paddingTop: top,
      }}
    >
      <View className="my-4 flex-1 px-8">
        <View className="flex-row items-center justify-between">
          <NLWLogo />

          <Link href="/memories" asChild>
            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full bg-purple-500"
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={16} color="#9E9EA0" />
            </TouchableOpacity>
          </Link>
        </View>
        <View className="mt-6 space-y-6">
          <View className="flex-row items-center gap-2">
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{
                false: '#28282d',
                true: '#764fd0',
              }}
              thumbColor={isPublic ? '#9b79ea' : '#56565a'}
            />

            <Text className="font-body text-base leading-relaxed text-gray-200">
              Tornar memória pública
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              borderStyle: 'dashed',
              borderRadius: 8,
              borderColor: '#2C2C31',
              borderWidth: 1,
            }}
            className="h-32 items-center justify-center bg-black/20"
            onPress={openImagePicker}
          >
            {preview ? (
              <Image
                source={{ uri: preview }}
                className="h-full w-full rounded-lg object-cover"
                alt="Preview image"
              />
            ) : (
              <View className="flex-row items-center gap-2">
                <Icon name="image" color="#9E9EA0" />
                <Text className="font-body text-sm text-gray-200">
                  Adicionar foto ou vídeo de capa
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            value={content}
            onChangeText={setContent}
            className="p-0 font-body text-lg leading-relaxed text-gray-100"
            cursorColor="#56565a"
            textAlignVertical="top"
            spellCheck={false}
            multiline
            placeholderTextColor="#56565a"
            placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          />
          <TouchableOpacity
            className="items-center self-end rounded-full bg-green-500 px-5 py-2"
            activeOpacity={0.7}
            onPress={handleCreateMemory}
          >
            <Text className="font-alt text-sm uppercase text-gray-900">
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
