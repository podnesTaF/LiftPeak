import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useQuery} from "@tanstack/react-query";
import api from "@shared/api/AxiosInstance";
import React from "react";
import { defaultStyles} from "@shared/styles";
import {useAssets} from "expo-asset";
import {useAuthStore} from "@features/auth";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import FollowingCircles from "@features/follow/ui/FollowingCircles";

export default function Followings() {

  const { scrollY } = useAnimatedScroll();


  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const {user} = useAuthStore();
  const [assets] = useAssets([require("@assets/images/logo/logo-long.png")])
  const {data} = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
        const {data} = await api.get("/users/profile");
        return data;
    }
  })


  return (
      <>
        <Animated.ScrollView  onScroll={scrollHandler}
                              scrollEventThrottle={16} style={defaultStyles.container}>
          <FollowingCircles />
          <View
          style={{height: 1000, width: "100%",}}
          ></View>
        </Animated.ScrollView>
      </>

  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
