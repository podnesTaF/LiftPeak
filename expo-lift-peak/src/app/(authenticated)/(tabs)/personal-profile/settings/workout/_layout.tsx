import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { Colors } from '@shared/styles'
import { Ionicons } from '@expo/vector-icons'

const Layout = () => {
  return (
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: Colors.dark700,
      },
      headerTintColor: Colors.white,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
      ),
      
    }}>
      <Stack.Screen name="units" />
    </Stack>
  )
}

export default Layout