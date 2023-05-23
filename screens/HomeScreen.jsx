import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { home_gif } from "../assets";
import { useNavigation } from "@react-navigation/native";
import * as Animate from "react-native-animatable";
import React from "react";

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 relative  bg-[#2f2f2f]">
      <View className="flex">
        {/* First Section */}
        <View className="flex-row mt-4 mx-4 space-x-2 items-center">
          <Animate.View
            animation="fadeInLeft"
            duration={1000}
            className=" bg-[#fab60f]  w-16 h-16 justify-center items-center rounded-full"
          >
            <Text className=" text-4xl font-[OrbitronBold]">$</Text>
          </Animate.View>
          <Animate.Text
            animation="fadeInRight"
            duration={1000}
            className=" text-[#f6f6f6] text-3xl font-[OrbitronBold]"
          >
            CurrencyX
          </Animate.Text>
        </View>

        {/* Second section */}
        <View className="mt-6  flex mx-6 ">
          <View className="flex-row space-x-2">
            <Animate.Text
              animation="fadeInLeft"
              duration={1000}
              className=" text-[#fab60f]  text-[42px] font-[MonstratMedium]"
            >
              Break
            </Animate.Text>
            <Animate.Text
              animation="fadeInRight"
              duration={1000}
              className=" text-[#f6f6f6]  text-[42px] font-[MonstratMedium]"
            >
              barriers
            </Animate.Text>
          </View>
          <Animate.Text
            animation="fadeInLeft"
            duration={1000}
            className=" text-[#f6f6f6] text-[20px] font-[MonstratLight]"
          >
            Our app lets you convert, compare, and conquer the global market
            with ease
          </Animate.Text>
          <Animate.Text
            animation="fadeInRight"
            duration={1000}
            className=" text-[#f6f6f6] text-[20px] font-[MonstratLight]"
          >
            Say hello to seamless currency exchange at your fingertips!
          </Animate.Text>
        </View>

        {/* Image Section */}
        <View className="flex justify-center items-center">
          <Image
            // source={gif}
            source={home_gif}
            className="w-[450px] h-[450px] object-contain "
          />
        </View>

        {/* Button section */}

        <View className=" flex justify-center  items-center px-6   w-full absolute -bottom-20">
          <TouchableOpacity
            className=" w-full flex-row items-center justify-center space-x-1"
            onPress={() => {
              navigation.navigate("Main");
            }}
          >
            <Animate.View
              animation="fadeInLeft"
              duration={500}
              className=" bg-[#fab60f] w-16 h-16 justify-center items-center rounded-full"
            >
              <Animate.Text className=" text-4xl font-[OrbitronBold] " animation="pulse" delay={500} iterationCount={Infinity}>E</Animate.Text>
            </Animate.View>
            <Animate.Text
              animation="fadeInRight"
              duration={500}
              className=" text-[#f6f6f6] text-3xl font-[OrbitronBold]"
            
            >
              xplore
            </Animate.Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
