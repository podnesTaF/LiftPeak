import {RefreshControl, StyleSheet, View} from 'react-native';

import React, {useCallback, useEffect, useState} from "react";
import {defaultStyles} from "@shared/styles";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import FollowingCircles from "@features/follow/ui/FollowingCircles";
import {PostFeed} from "@features/feed";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import {queryClient} from "@shared/api";


export default function Followings() {
    const {scrollY} = useAnimatedScroll();
    const [refreshing, setRefreshing] = useState(false);
    const tabBarHeight = useBottomTabBarHeight() + 20;

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        console.log("works")
        queryClient.invalidateQueries({
            queryKey: ['workouts']
        }).then(() => {
            setRefreshing(false);
        });
    }, [queryClient]);


    return (
        <>
            <Animated.ScrollView onScroll={scrollHandler}
                                 scrollEventThrottle={16}
                                 style={[defaultStyles.container]}
                                 contentContainerStyle={{paddingBottom: tabBarHeight}}
                                 refreshControl={
                                     <RefreshControl tintColor={"white"} colors={["white"]} refreshing={refreshing} onRefresh={onRefresh}/>
                                 }
            >
                <FollowingCircles/>
                <PostFeed />
            </Animated.ScrollView>
        </>

    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
