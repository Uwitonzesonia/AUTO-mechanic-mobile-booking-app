import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

const SLIDE_COUNT = 2;

const LoginHomepage: React.FC = () => {
  const router = useRouter();
  const [activeSlide] = useState(0);

  return (
    <View className="flex-1 bg-[#0b0d12]">
      <ImageBackground
        source={require("../../assets/image/login-bg.png")}
        className="flex-[0.55] min-h-[340px]"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/40" />

        <View className="items-center justify-center pt-8">
          <Image
            source={require("../../assets/image/logo.png")}
            className="w-[110px] h-[36px]"
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      <View className="flex-[0.45] px-6 pt-2 pb-8">
        <Text className="text-white text-[28px] leading-[34px] font-bold mt-1 mb-3">
          Lets Get{"\n"}started with us
        </Text>

        <Text className="text-[#a7a9b3] text-[13px] leading-[20px] mb-5 max-w-[280px]">
          Get started with our service, designed for convenient repair
          bookings. Get acquainted with tools created to enhance vehicle
          ownership pleasures and help safeguard your vehicle against
          unprofessional repairs.
        </Text>

        <View className="flex-row items-center gap-1.5 mb-7">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                i === activeSlide ? "w-5 bg-white" : "w-1.5 bg-[#4a4c56]"
              }`}
            />
          ))}
        </View>

        <View className="mt-auto gap-3.5">
          <Pressable
            onPress={() => router.push("/login")}
            className="w-full py-4 rounded-full bg-white items-center active:opacity-90"
          >
            <Text className="text-[#0b0d12] text-[15px] font-semibold">
              Login
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/register")}
            className="w-full py-4 rounded-full border-[1.5px] border-white/35 items-center active:bg-white/10"
          >
            <Text className="text-white text-[15px] font-semibold">
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginHomepage;