import React from 'react';
import {Stack, Tabs, useLocalSearchParams, useRouter} from "expo-router";
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import {useQuery} from "@tanstack/react-query";
import {getGroup} from "@entities/group";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import Constants from "expo-constants";
import {Ionicons} from "@expo/vector-icons";
import {BlurView} from "expo-blur";

const Layout = () => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const scrollY = useSharedValue(0);
    const router = useRouter();
    const {data} = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroup(id),
        enabled: !!id
    })

    const textStyle = useAnimatedStyle(() => {
        const bottom = interpolate(
            scrollY.value,
            [150, 200],
            [0, -20],
            Extrapolation.CLAMP
        )

        const opacity = interpolate(
            scrollY.value,
            [150, 200],
            [1, 0],
            Extrapolation.CLAMP
        )

        return {
            bottom: bottom,
            opacity: scrollY.value > 0 ? opacity : 1
        }
    })

    const nameStyle = useAnimatedStyle(() => {
        const bottom = interpolate(
            scrollY.value,
            [150, 200],
            [-20, 0],
            Extrapolation.CLAMP
        )
        const opacity = interpolate(
            scrollY.value,
            [150, 200],
            [0,1],
            Extrapolation.CLAMP
        )
        return {
            bottom,
            opacity,
        }
    })


    return (
        <AnimatedScrollProvider scrollY={scrollY}>
            <Stack.Screen options={{
               headerShown:false
            }}/>
            <Stack>
                <Stack.Screen name={"index"} options={{
                    headerShown: true,
                    headerTransparent: true,
                    header: () => (
                        <BlurView tint={"dark"} intensity={0} style={[{flexDirection: "row", width: "100%", alignItems: "center", overflow: "hidden", justifyContent: "space-between", paddingBottom: 12, paddingTop: Constants.statusBarHeight}]}>
                            <TouchableOpacity onPress={()=> router.back()} style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{paddingHorizontal: 12}}>
                                    <TouchableOpacity onPress={()=> router.back()} >
                                        <Ionicons name={"chevron-back"} size={30} color={"white"} />
                                    </TouchableOpacity>
                                </View>
                                <Animated.View style={[textStyle]}>
                                    <Text style={[defaultStyles.smallTitle]}>
                                        Group
                                    </Text>
                                </Animated.View>
                                <Animated.View style={[{position: 'absolute', left: 55, top: 4},nameStyle]}>
                                    <Text style={defaultStyles.smallTitle}>
                                        {data?.name}
                                    </Text>
                                </Animated.View>
                            </TouchableOpacity>
                            <View style={{paddingHorizontal: 12}}>
                                <TouchableOpacity onPress={()=> router.back()} >
                                    <Ionicons name={"ellipsis-vertical"} size={30} color={Colors.white}/>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    ),
                }}/>
                <Stack.Screen name={"members"} options={{
                    headerShown: false
                }}/>
            </Stack>
        </AnimatedScrollProvider>
    );
};

export default Layout;