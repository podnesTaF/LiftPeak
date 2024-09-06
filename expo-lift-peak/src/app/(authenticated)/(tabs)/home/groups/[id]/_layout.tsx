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
            [16, -20],
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
            [-20, 16],
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
                headerShown: true,
                headerTransparent: false,
                header: () => (
                    <View style={[{flexDirection: "row", width: "100%", alignItems: "center", overflow: "hidden", justifyContent: "space-between", paddingBottom: 12, paddingTop: Constants.statusBarHeight, backgroundColor: Colors.dark700}]}>
                        <View style={{paddingHorizontal: 12}}>
                            <TouchableOpacity onPress={()=> router.back()} >
                                <Ionicons name={"chevron-back"} size={30} color={"white"} />
                            </TouchableOpacity>
                        </View>
                        <Animated.View style={[{position: "absolute", left: 70},textStyle]}>
                            <Text style={[defaultStyles.smallTitle]}>
                                Group
                            </Text>
                        </Animated.View>
                        <Animated.View style={[{position: "absolute", left: 70}, nameStyle]}>
                            <Text style={defaultStyles.smallTitle}>
                                {data?.name}
                            </Text>
                        </Animated.View>
                        <View style={{paddingHorizontal: 12}}>
                            <TouchableOpacity onPress={()=> router.back()} >
                                <Ionicons name={"ellipsis-vertical"} size={30} color={Colors.white}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                ),
            }}/>
            <Stack>
                <Stack.Screen name={"index"} options={{
                    headerShown: false
                }}/>
            </Stack>
        </AnimatedScrollProvider>
    );
};

export default Layout;