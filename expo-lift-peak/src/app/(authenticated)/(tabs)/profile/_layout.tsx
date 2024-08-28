import React from 'react';
import {Stack, Tabs, useLocalSearchParams, useRouter} from "expo-router";

import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import {
    useSharedValue
} from "react-native-reanimated";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo} from "@features/profile";
import ProfileTopHeader from "@features/profile/ui/ProfileTopHeader";

const Layout = () => {
    const {id} = useLocalSearchParams<{id?: string}>()
    const scrollY = useSharedValue(0);

    const {data} = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserInfo(id),
        enabled: !!id
    })


    return (
        <AnimatedScrollProvider scrollY={scrollY}>
            <Tabs.Screen options={{
                headerTransparent: false,
                header: () => (
                   <ProfileTopHeader user={data} />
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