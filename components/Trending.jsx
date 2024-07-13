import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'

const Trending = (posts) => {
  return (
    <FlatList
    data={posts}
    horizontal
    keyExtractor={(item) => item.$id}
    renderItem={({ item }) => (
      <Text className="text-3xl">{item.id}</Text>
    )}
    />
  )
}

export default Trending