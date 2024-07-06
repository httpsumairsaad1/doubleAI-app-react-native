import { Slot, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}} />
    </Stack>
  )
}

export default RootLayout