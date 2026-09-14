import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RepairDashboardProps {
  statusText?: string;
  badgeText?: string;
  avatarSource: any;
  carImageSource: any;
  brandLogoSource: any;
  carModel?: string;
  carMake?: string;
  carYear?: string;
  onPressEngineFix?: () => void;
}

export const RepairDashboardCard: React.FC<RepairDashboardProps> = ({
  statusText = "Repair in Progress",
  badgeText = "Engine Fix",
  avatarSource,
  carImageSource,
  brandLogoSource,
  carModel = "Corolla",
  carMake = "Toyota",
  carYear = "2025",
  onPressEngineFix,
}) => {
  return (
    <View className="flex-1 bg-[#121824] p-4">
     
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-row items-center justify-between py-3 px-4 rounded-full mb-6"
      >
        <View className="relative">
          <Image 
            source={avatarSource} 
            className="w-12 h-12 rounded-full border-2 border-[#7a88ef]" 
          />
          <View className="absolute -bottom-0.5 -right-0.5 bg-[#191c24] w-5 h-5 rounded-full items-center justify-center border-[1.5px] border-white">
            <Icon name="wrench" size={10} color="#FFFFFF" />
          </View>
        </View>

        <Text className="text-white text-base font-semibold flex-1 ml-3">
          {statusText}
        </Text>

        <TouchableOpacity 
          onPress={onPressEngineFix} 
          activeOpacity={0.8}
          className="bg-white py-2 px-4 rounded-full shadow-md elevation-3"
        >
          <Text className="text-[#121824] text-sm font-semibold">
            {badgeText}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <View className="bg-[#1b2230] rounded-3xl p-5 border border-[#263042]">
       
        <View className="items-center justify-center my-4">
          <Image 
            source={carImageSource} 
            className="w-full h-44" 
            resizeMode="contain" 
          />
        </View>
        <View className="flex-row items-end justify-between mt-2">
          <View>
            <Text className="text-white text-2xl font-bold mb-1">
              {carModel}
            </Text>
            <Text className="text-gray-400 text-sm">
              {carMake} • {carYear}
            </Text>
          </View>

          <Image 
            source={brandLogoSource} 
            className="w-10 h-12" 
            resizeMode="contain" 
          />
        </View>
      </View>
    </View>
  );
};
