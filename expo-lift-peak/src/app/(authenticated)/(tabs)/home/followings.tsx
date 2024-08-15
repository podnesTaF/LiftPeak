import {StyleSheet, View} from 'react-native';

import React, {useEffect} from "react";
import { defaultStyles} from "@shared/styles";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import FollowingCircles from "@features/follow/ui/FollowingCircles";
import {PostFeed} from "@features/feed";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";



export default function Followings() {
  const { scrollY } = useAnimatedScroll();

  const tabBarHeight = useBottomTabBarHeight() + 20;

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  return (
      <>
        <Animated.ScrollView onScroll={scrollHandler}
                              scrollEventThrottle={16} style={[defaultStyles.container]} contentContainerStyle={{paddingBottom: tabBarHeight}}>
          <FollowingCircles  />
          <PostFeed />
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
