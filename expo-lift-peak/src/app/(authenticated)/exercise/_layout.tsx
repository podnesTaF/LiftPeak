import React, {useEffect} from 'react';
import MaterialTopTabs from "@shared/components/tabs/MaterialTopTabs";
import CustomTopTabBar from "@shared/components/tabs/CustomTopTabBar";
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {AnimatedScrollProvider, useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import {Color} from "ansi-fragments/build/fragments/Color";
import {ExerciseVideo} from "@entities/exercise";
import Button from "@shared/components/Button";

const Layout = () => {
    const router = useRouter();
    const {id} = useLocalSearchParams<{id: string}>();
    const scrollY = useSharedValue(0);
    const [activeVideo, setActiveVideo] = React.useState<number>(0);

    const animatedHeaderStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [25, 50], [0, 1]);
        return {
            opacity: scrollY.value > 0 ? opacity : 1,
        };
    });

    const animatedTitleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 30], [1, 0]);
        const top = interpolate(scrollY.value, [0, 30], [12, -20]);
        return {
            opacity,
            top: scrollY.value > 0 ? top : 12,
        }
    })

    const animatedContainerStyle = useAnimatedStyle(() => {
        const paddingTop = interpolate(scrollY.value, [0, 50], [50, 12]);
        return {
            paddingTop: scrollY.value <= 0 ? 50 : paddingTop,
        }
    })

    return (
        <AnimatedScrollProvider scrollY={scrollY}>
            <Stack.Screen
              options={{
                  header: () => (
                      <SafeAreaView style={{backgroundColor: Colors.dark700}}>
                          <View style={{paddingVertical: 10, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", backgroundColor: Colors.dark700, zIndex: 10}}>
                            <TouchableOpacity style={{position: "absolute", left: 12, top: 6}} onPress={router.back}>
                                <Ionicons name={'chevron-back'} size={30} color={Colors.white}/>
                            </TouchableOpacity>
                            <Animated.View style={[{flex: 1,alignItems: "center"}, animatedHeaderStyle]}>
                                <Text style={{color: 'white', fontWeight: "600", fontSize: 16}}>
                                    SkullCrusher ({id})
                                </Text>
                            </Animated.View>
                          </View>
                          <Animated.View style={[{padding: 12, paddingTop: 50, gap: 12 }, animatedContainerStyle]}>
                             <Animated.View style={[{position: "absolute", left:12, top:12}, animatedTitleStyle]}>
                                 <Text style={[defaultStyles.header, {fontSize: 24}]}>
                                     SkullCrusher ({id})
                                 </Text>
                             </Animated.View>
                              <Text style={defaultStyles.secondaryText}>
                                  Triceps, Lats
                              </Text>
                          </Animated.View>
                      </SafeAreaView>
                  )
              }}
            />
            <MaterialTopTabs
                tabBar={(props) => <CustomTopTabBar {...props} />}
            >
                <MaterialTopTabs.Screen name={'index'} options={{
                    title: "Stats"
                }} />
                <MaterialTopTabs.Screen name={'instruction'} options={{
                    title: "Instructions"
                }} />
                <MaterialTopTabs.Screen name={'alternatives'} options={{
                    title: "Alternatives"
                }} />
            </MaterialTopTabs>
        </AnimatedScrollProvider>
    );
};

export default Layout;