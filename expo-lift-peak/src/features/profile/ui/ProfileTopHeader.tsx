import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import Constants from "expo-constants";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {usePathname, useRouter} from "expo-router";
import {IUser} from "@entities/user";
import {useAuthStore} from "@features/auth";
import {BlurView} from "expo-blur";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";

interface ProfileTopHeaderProps {
    left?: React.ReactNode;
    type: "profile" | "group"
    name: string;
    right?: React.ReactNode;
}

const ProfileTopHeader = ({left, name, right}: ProfileTopHeaderProps) => {
    const {scrollY} = useAnimatedScroll();
    const router = useRouter();


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
        <BlurView tint={"dark"} intensity={0} style={[{flexDirection: "row", width: "100%", alignItems: "center", overflow: "hidden", justifyContent: "space-between", paddingBottom: 12, paddingTop: Constants.statusBarHeight}]}>
            <TouchableOpacity onPress={()=> router.back()} style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{paddingHorizontal: 12}}>
                    <TouchableOpacity onPress={()=> router.back()} >
                        <Ionicons name={"chevron-back"} size={30} color={"white"} />
                    </TouchableOpacity>
                </View>
                <Animated.View style={[textStyle]}>
                    <Text style={[defaultStyles.smallTitle]}>
                        Profile
                    </Text>
                </Animated.View>
                <Animated.View style={[{position: 'absolute', left: 55, top: 4},nameStyle]}>
                    <Text style={defaultStyles.smallTitle}>
                        {name}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
            <View style={{paddingHorizontal: 12}}>
                {right}
            </View>
        </BlurView>
    );
};

export default ProfileTopHeader;