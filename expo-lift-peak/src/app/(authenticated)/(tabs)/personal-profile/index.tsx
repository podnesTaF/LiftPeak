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
    //we get scrollY value bu the help of context
    const {scrollY} = useAnimatedScroll();


    const {data} = useQuery({
        queryKey: ['user', user?.id],
        // whenever the user.id changes, React Query will know that it needs to refetch the user data
        queryFn: () => getUserInfo(user?.id),
        enabled: !!user?.id
    })

    // hook used to handle scroll events in an animated way
    // it listens for the onScroll event
    //the function we pass inside of this hook will be executed every time the user scrolls
    const onScroll = useAnimatedScrollHandler((event) => {
        //event.contentOffset.y gives the current scroll position in pixels.
        scrollY.value = event.contentOffset.y;
    });

    return (
        //on scroll, our defined on scroll function will be executed
        <Animated.ScrollView onScroll={onScroll} stickyHeaderIndices={[1]} contentContainerStyle={{paddingBottom: 120}}
                             style={defaultStyles.container} scrollEventThrottle={16}>
    {/* scrollEventThrottle={16} means that the onScroll event will fire every 16 milliseconds, 
    which corresponds to about 60 frames per second (fps). 
    This is a common frame rate for smooth animations and user interactions. */}
            <ProfileHeader user={data}/>
            <CustomTabBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={[{name: 'about'}, {name: 'statistics'}]}/>
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