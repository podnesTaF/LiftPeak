import {FlatList, RefreshControl, StyleSheet, View, ViewToken} from 'react-native';

import React, {useCallback, useEffect, useRef, useState} from "react";
import {defaultStyles} from "@shared/styles";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import FollowingCircles from "@features/follow/ui/FollowingCircles";
import {getAllWorkouts, markAsSeen, PostFeed} from "@features/feed";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import {queryClient} from "@shared/api";
import WorkoutPost from "../../../../features/feed/ui/WorkoutPost";
import {useMutation, useQuery} from "@tanstack/react-query";
import {PostType} from "@entities/post";


export default function Followings() {
    const {scrollY} = useAnimatedScroll();
    const [refreshing, setRefreshing] = useState(false);
    const [visibleItems, setVisibleItems] = useState<number[]>([]);

    const tabBarHeight = useBottomTabBarHeight() + 20;

    const {data: workouts} = useQuery({
        queryKey: ["workouts"],
        queryFn: getAllWorkouts,
    })

    const {mutate: markAsRead} = useMutation({
        mutationFn: ({id, type}:{id: number, type: PostType}) => markAsSeen(id, type),
        retryDelay: 10000,
        retry: 3
    });

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        queryClient.invalidateQueries({
            queryKey: ['workouts']
        }).then(() => {
            setRefreshing(false);
        });
    }, [queryClient]);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        const visibleIds = viewableItems.map(item => item.item.id);
        setTimeout(() => {
            markAsRead({id: visibleIds[0], type: PostType.WORKOUT});
        }, 1000);
        setVisibleItems(visibleIds);
    }).current;

    return (
        <>
            <Animated.FlatList
                onScroll={scrollHandler}
                style={[defaultStyles.container]}
                contentContainerStyle={{paddingBottom: tabBarHeight}}
                data={workouts}
                ListHeaderComponent={<FollowingCircles/>}
                renderItem={({item}) => (
                    <WorkoutPost  workout={item} isViewable={!!visibleItems.find((id) => id  === item.id )} />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                keyExtractor={(item) => item.id.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 40,
                }}
            />
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
