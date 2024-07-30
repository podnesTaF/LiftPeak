import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useQuery} from "@tanstack/react-query";
import api from "@shared/api/AxiosInstance";
import React from "react";
import {Colors, defaultStyles} from "@shared/styles";
import {Stack, Tabs} from "expo-router";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import {useAssets} from "expo-asset";
import {useAuthStore} from "@features/auth";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";

export default function TabOneScreen() {
  const {user} = useAuthStore();
  const [assets] = useAssets([require("@assets/images/logo/logo-long.png")])
  const {data} = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
        const {data} = await api.get("/users/profile");
        return data;
    }
  })

  const { scrollY } = useAnimatedScroll();

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });


  return (
      <>
        <Animated.ScrollView  onScroll={scrollHandler}
                              scrollEventThrottle={16} style={defaultStyles.container}>
          <Text style={styles.title}>Tab One</Text>
          <Text>{JSON.stringify(data)}</Text>
          <View style={styles.separator} />
          {[1, 2, 3, 4, 5,6,7,8,9].map((item) => (
              <View key={item} style={{height: 200}}>
                <Text style={{color: "white"}}>{item}</Text>
              </View>
          ))}
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
