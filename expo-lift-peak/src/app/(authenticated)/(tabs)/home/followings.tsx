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
import {fetchUserProfile} from "@entities/user";

export default function Followings() {

  const { scrollY } = useAnimatedScroll();


  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });


  return (
      <>
        <Animated.ScrollView onScroll={scrollHandler}
                              scrollEventThrottle={16} style={defaultStyles.container}>
          <FollowingCircles  />
          <View style={{height: 1000}}>

          </View>
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
