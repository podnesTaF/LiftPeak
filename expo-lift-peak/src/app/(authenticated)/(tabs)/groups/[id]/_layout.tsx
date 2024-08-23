import React from 'react';
import {Stack, Tabs, useLocalSearchParams} from "expo-router";
import Animated, {useSharedValue} from "react-native-reanimated";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo} from "@features/profile";
import {getGroup} from "@entities/group";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import ProfileTopHeader from "@features/profile/ui/ProfileTopHeader";
import {Text, View} from "react-native";
import {defaultStyles} from "@shared/styles";

const Layout = () => {
    const {id} = useLocalSearchParams<{id?: string}>()
    const scrollY = useSharedValue(0);

    const {data} = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroup(id),
        enabled: !!id
    })


    return (
        <AnimatedScrollProvider scrollY={scrollY}>
            <Tabs.Screen options={{
                headerTransparent: false,
                header: () => (
                    <View style={[{position: "absolute", left: 70}]}>
                        <Text style={[defaultStyles.smallTitle]}>
                            Profile
                        </Text>
                    </View>
                ),
            }} />
            <Stack>
                <Stack.Screen name={"index"} options={{
                    headerShown: false
                }} />
            </Stack>
        </AnimatedScrollProvider>
    );
};

export default Layout;