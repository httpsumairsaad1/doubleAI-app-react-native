import { Text, View, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React from 'react'
import { useState, useEffect } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants"; 
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import VideoCard from "../../components/VideoCard"
import EmptyState from '../../components/EmptyState';
import { getAllPosts, getLatestPosts } from "../../lib/appwrite"
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
const { data: posts, refetch } = useAppwrite(getAllPosts);
const { data: latestPosts } = useAppwrite(getLatestPosts);
const { user, setUser, setIsLogged } = useGlobalContext();

const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // console.log(posts);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        // data={[{id:1}, {id:2}, {id:3}]}
        data={posts}
        keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            // <Text className="text-3xl text-white">{item.id}</Text>
            <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
          )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                {/* heading */}
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back,
                </Text>
                {/* Username */}
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username} 
                </Text>
              </View>

              {/* style={{ position: 'absolute', top: -10, right: -250 }} */}
              <View className="mt-1.5" >
                <Image
                 
                  source={images.daiLogo}
                  className="w-14 h-14"
                  resizeMode="contain"
                />
              </View>
            </View>
            
            <SearchInput/>

            <View className="w-full flex-1 pt-5 pb-8">
            <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      </SafeAreaView>
  )
}

export default Home

