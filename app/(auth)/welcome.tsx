import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View,Image } from "react-native";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants";
import CustomButton from "@/components/CustomButton";

const Welcome = () => {

  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hideNext,setHideNext] = useState(false);
  
  const isLastSlide = activeIndex === onboarding.length - 1;

  

  return (
    <SafeAreaView className="flex h-full items-center justify-between">
      <TouchableOpacity 
        onPress={() => {router.replace('/(auth)/sign-in')}}
        className="w-full flex justify-end items-end p-5"
        >
        <Text>Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={(<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] round-full" />)}
        activeDot={(<View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />)}
        onIndexChanged={(index) =>  setActiveIndex(index)}>
        {onboarding.map((item) => (
          <View 
            key={item.id}
            className="flex items-center justify-center p-5"
            >
            <Image 
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            /> 
            <View
              className="flex flex-row items-center justify-center w-full mt-10"
            >
              <Text className="text-black text-3xl mx-10 font-bold text-center">
                {item.title}
              </Text>
            </View>
            <Text 
              className="text-md font-JakartaSemiBold text-lg text-center my-3 mx-10 text-[#858585]">{item.description}</Text>
            
          </View>
        ))}
      </Swiper>
      <View className="mb-3 px-2 w-full flex items-center">
        <CustomButton 
          title={`${isLastSlide ? 'Get Started' : 'Next'}`}
          onPress={() => isLastSlide ? router.replace('/(auth)/sign-up') : swiperRef.current?.scrollBy(1)}
          className="w-11/12 mt-10" />
        
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
