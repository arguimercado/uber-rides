import { useUser } from "@clerk/clerk-expo";
import { FlatList, View,Text,Image, ActivityIndicator,TouchableOpacity } from "react-native";

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { recentRides } from "@/mocks/ride";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";



const Home = () => {

  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        //data={[]}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image source={images.noResult} className="w-40 h-40" alt="no recent rides" resizeMode="contain"/>
                <Text className="text-sm">No recent rides</Text>
              </>
            ) : (
              <ActivityIndicator size={"small"} color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl font-JakartaExtraBold">Welcome {user?.firstName || user?.emailAddresses[0].emailAddress} </Text>
              <TouchableOpacity>
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
