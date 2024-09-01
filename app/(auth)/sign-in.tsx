import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Image } from "react-native";
import { icons, images } from "@/constants";
import OAuth from "@/components/OAuth";
import { Link, router } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useSignIn } from "@clerk/clerk-expo";
import { toHome } from "@/constants/route-list";

const useSignInHook = () => {

  const { signIn, setActive, isLoaded } = useSignIn();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  const onSignInPress = useCallback(async () => {
    
    if (!isLoaded) {
      return
    }

    try {

      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      if (signInAttempt.status === 'complete') {
        
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace(toHome);

      } 
      else {
        
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form]);


  return {form,setForm,onSignInPress,isLoaded}
}

const SignInForm = () => {
  
  const { form,setForm,onSignInPress} = useSignInHook();

  return (
    <View className="p-5">
      <InputField
        label="Email"
        placeholder="Enter your email"
        icon={icons.email}
        value={form.email}
        onChangeText={(value) => setForm({ ...form, email: value })} />
      <InputField
        label="Password"
        placeholder="Enter your password"
        icon={icons.lock}
        value={form.password}
        secureTextEntry={true}
        onChangeText={(value) => setForm({ ...form, password: value })} />

       <CustomButton title="Sign In" bgVariant="success" onPress={onSignInPress} className="mt-6"/>
    </View>
  );
};

const SignIn = () => {

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View>
            <Image source={images.signUpCar} className="z-0 w-full h-[200px]" />
            <Text className="text-2xl text-black absolute bottom-5 left-5 font-JakartaSemiBold">
              Log in
            </Text>
          </View>
        </View>
        <SignInForm />
        <OAuth />
        <View>
          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10">
            <Text>Don't have an account? </Text>
            <Text className="text-primary-500">Sign up</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
