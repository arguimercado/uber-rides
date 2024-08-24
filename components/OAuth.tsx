import React from "react";
import { View, Text, Image } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";

const OAuth = () => {

  const handleGoogleSignIn = () => {};
  
	
	return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg ">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <View className="w-full flex flex-1 px-5">
        <CustomButton
          bgVariant="outline"
          textVariant="primary"
          className="mt-5 w-full shadow-none"
          title="Log in as Google"
          IconLeft={() => (
            <Image
              source={icons.google}
              resizeMode="contain"
              className="w-5 h-5 mx-2 "
            />
          )}
          onPress={handleGoogleSignIn}
        />
      </View>
    </View>
  );
};

export default OAuth;
