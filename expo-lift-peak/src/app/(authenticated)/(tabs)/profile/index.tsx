import React from 'react';
import {Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {getUserInfo, ProfileHeader, UserInfo} from "@features/profile";
import {defaultStyles} from "@shared/styles";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import {useHeaderHeight} from "@react-navigation/elements";

const AboutProfile = () => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const [activeTab, setActiveTab] = React.useState('about')
    const {scrollY} = useAnimatedScroll();

    const {data} = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserInfo(id),
        enabled: !!id
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
            {activeTab === 'statistics' && (
                <View>
                    <Text style={{color: 'white'}}>Stats</Text>
                </View>
            )}
        </Animated.ScrollView>
    );
};

export default AboutProfile;