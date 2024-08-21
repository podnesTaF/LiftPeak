import {useAuthStore} from "@features/auth";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo, ProfileHeader, UserInfo} from "@features/profile";
import {ScrollView, Text, View} from "react-native";
import {defaultStyles} from "@shared/styles";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import React from "react";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";

const ProfileOverview = () => {
    const {user} = useAuthStore();
    const [activeTab, setActiveTab] = React.useState('about')
    const {scrollY} = useAnimatedScroll();


    const {data} = useQuery({
        queryKey: ['user', user?.id],
        queryFn: () => getUserInfo(user?.id),
        enabled: !!user?.id
    })

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <Animated.ScrollView onScroll={onScroll} stickyHeaderIndices={[1]} contentContainerStyle={{paddingBottom: 120}}
                             style={defaultStyles.container} scrollEventThrottle={16}>
            <ProfileHeader user={data}/>
            <CustomTabBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={['about', 'statistics']}/>
            {activeTab === 'about' && (
                data ? (
                    <UserInfo user={data}/>
                ) : (
                    <Text style={{color: 'white'}}>Loading...</Text>
                )
            )}
        </Animated.ScrollView>
    );
};

export default ProfileOverview;