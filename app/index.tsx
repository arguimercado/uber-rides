import React from 'react'
import { View,Text, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className='text-2xl'>Index</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

export default Home