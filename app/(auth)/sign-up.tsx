import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { SignUpProps, VerificationProps } from "@/types/type";
import { fetchAPI } from "@/lib/fetch";

const useSignupHook = () => {

  const { isLoaded, signUp, setActive } = useSignUp();

  const [verification, setVerification] = useState<VerificationProps>({
    state: "default",
    error: "",
    code: "",
  });

  const [form, setForm] = useState<SignUpProps>({
    name: "",
    email: "",
    password: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      //console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const saveOnPost = async  () =>  {

    const data = JSON.stringify({
      name: form.name,
      email: form.email,
      clerkId: 'user_1235'
    });
    
    await fetchAPI('/(api)/user', {
      method: "POST",
      body: data
    });
  }

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        //TODO: Create db user
        await fetchAPI('/(api)/user', {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId
          })
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "verification failed",
          state: "failed",
        });
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setVerification({
        ...verification,
        error: err.errors[0].lognMessage,
        state: "failed",
      });
    }
  };

  return {
    form,
    setForm,
    verification,
    setVerification,
    onSignUpPress,
    onPressVerify,
    saveOnPost
  };

};

const SignUpForm = ({
  verification,
  setVerification,
  form,
  setForm,
  onSignUpPress,
}: {
  verification: VerificationProps;
  setVerification: (verification: VerificationProps) => void;
  form: SignUpProps;
  setForm: (form: SignUpProps) => void;
  onSignUpPress: () => void;
}) => {

  return (

    <View className="p-5">
      <InputField
        label="Name"
        placeholder="Enter your name"
        icon={icons.person}
        value={form.name}
        onChangeText={(value) => setForm({ ...form, name: value })}
      />
      <InputField
        label="Email"
        placeholder="Enter your email"
        icon={icons.email}
        value={form.email}
        onChangeText={(value) => setForm({ ...form, email: value })}
      />
      <InputField
        label="Password"
        placeholder="Enter your password"
        icon={icons.lock}
        value={form.password}
        secureTextEntry={true}
        onChangeText={(value) => setForm({ ...form, password: value })}
      />
      <CustomButton title="Sign Up" onPress={(event) => onSignUpPress()} className="mt-6" />
    </View>
  );
};

const Signup = () => {

  const { verification, setVerification, form, setForm,onPressVerify,onSignUpPress } = useSignupHook();
  const [showVerified,setShowVerified] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View>
            <Image source={images.signUpCar} className="z-0 w-full h-[200px]" />
            <Text className="text-2xl text-black absolute bottom-5 left-5 font-JakartaSemiBold">
              Create an Account
            </Text>
          </View>
        </View>
        <SignUpForm
          form={form}
          setForm={setForm}
          setVerification={setVerification}
          verification={verification}
          onSignUpPress={onSignUpPress} />
        <OAuth />
        <View>
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log-in</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal
          onModalHide={() => {            
            setVerification({ ...verification, state: "success" })
            setShowVerified(true)
          }}
          isVisible={verification.state === "pending"} >

          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2 text-center ">Verification</Text>
            <Text className="font-JakartaLight mb-5 text-center">We have sent verification to your email</Text>
            <InputField
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
              label="Verification Code"
              placeholder="Please enter code"
              icon={icons.lock}
              value={verification.code}
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton title="Verify Email" onPress={() => onPressVerify()} className="mt-5 bg-success-500"/>
          </View>
        </ReactNativeModal>

        {/* success */}
        <ReactNativeModal isVisible={showVerified}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5" />
            <Text className="font-JakartaSemiBold text-black text-center text-3xl">
              Verified
            </Text>
            <Text className="text-base text-center font- font-Jakarta mt-2 text-gray-400">
              You have successfully verified your account
            </Text>
            <CustomButton
              title="Home"
              onPress={() => router.replace("/(root)/(tabs)/home")}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
