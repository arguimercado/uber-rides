import React from 'react'
import { View,Text, StatusBar } from 'react-native'

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className='text-2xl'>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

export default Home