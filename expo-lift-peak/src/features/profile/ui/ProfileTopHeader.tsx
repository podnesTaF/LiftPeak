import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import Constants from "expo-constants";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {usePathname, useRouter} from "expo-router";
import {IUser} from "@entities/user";
import {useAuthStore} from "@features/auth";

const ProfileTopHeader = ({user}: {user?: IUser}) => {
    const scrollY = useSharedValue(0);
    const router = useRouter();
    const pathname = usePathname();
    const {clearAuth} = useAuthStore()

    return (
        <View style={[{flexDirection: "row", width: "100%", alignItems: "center", overflow: "hidden", justifyContent: "space-between", paddingHorizontal: 12, paddingBottom: 12, paddingTop: Constants.statusBarHeight, backgroundColor: Colors.dark700}]}>
            {pathname !== '/personal-profile' && <View style={{paddingHorizontal: 12}}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name={"chevron-back"} size={30} color={"white"}/>
                </TouchableOpacity>
            </View>}
            <View>
                <Text style={defaultStyles.smallTitle}>
                    {user?.profile?.firstName} {user?.profile?.lastName}
                </Text>
            </View>
            <View style={{paddingHorizontal: 12}}>
                <TouchableOpacity onPress={()=> {
                    clearAuth()
                }} >
                    <Ionicons name={"exit-outline"} size={24} color={Colors.white}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileTopHeader;