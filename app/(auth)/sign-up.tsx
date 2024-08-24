import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

import { icons, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import OAuth from "@/components/OAuth";


const SignUpForm = () => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handlePress =  async () => {

  }

  return (
    <View className="p-5">
      <InputField 
        label="Name"
        placeholder="Enter your name"
        icon={icons.person}
        value={form.name}
        onChange={(value) => setForm({...form, name: value})}
      />
       <InputField 
        label="Email"
        placeholder="Enter your email"
        icon={icons.email}
        value={form.email}
        onChange={(value) => setForm({...form, email: value})}
      />
      <InputField 
        label="Password"
        placeholder="Enter your email"
        icon={icons.lock}
        value={form.password}
        secureTextEntry={true}
        onChange={(value) => setForm({...form, password: value})}
      />
      <CustomButton title="Sign Up" onPress={handlePress} className="mt-6"/>
      
    </View>
  )
}

const Signup = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View>
            <Image 
              source={images.signUpCar} className="z-0 w-full h-[200px]"
            />
            <Text className="text-2xl text-black absolute bottom-5 left-5 font-JakartaSemiBold">Create an Account</Text>
          </View>
        </View>
        <SignUpForm />
        <OAuth />
        <View>
          <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
            <Text>Already have an account?{' '}</Text>
            <Text className="text-primary-500">Log-in</Text>
          </Link>
        </View>
        {/* Verification Modal */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
