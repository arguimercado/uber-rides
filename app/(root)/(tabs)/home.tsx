import { useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { recentRides } from "@/mocks/ride";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { router } from "expo-router";

const ListEmptyComponent = ({ loading }: { loading: boolean }) => {
  return (
    <View className="flex flex-col items-center justify-center">
      {!loading ? (
        <>
          <Image
            source={images.noResult}
            className="w-40 h-40"
            alt="no recent rides"
            resizeMode="contain"
          />
          <Text className="text-sm">No recent rides</Text>
        </>
      ) : (
        <ActivityIndicator size={"small"} color="#000" />
      )}
    </View>
  );
};
const Home = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords.longitude!,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };

    requestLocation();
  }, []);

  const handleSignOut = () => {};

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => <ListEmptyComponent loading={loading} />}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <View className="flex flex-col justify-end">
                <Text className="text-xl font-JakartaExtraBold">Welcome</Text>
                <Text className="text-sm font-JakartaMedium">
                  {user?.firstName || user?.emailAddresses[0].emailAddress}
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />
            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your Current Location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>
            <Text className="text-xl font-JakartaBold font-bold">
              Recent Ride
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
