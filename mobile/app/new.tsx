import { useState } from 'react'
import {
  View,
  TouchableOpacity,
  Switch,
  Text,
  TextInput,
  ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link } from 'expo-router'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

export default function NewMemory() {
  const [isPublic, setIsPublic] = useState(false)
  const { top, bottom } = useSafeAreaInsets()

  return (
    <ScrollView
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
          >
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#9E9EA0" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          </TouchableOpacity>
          <TextInput
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
