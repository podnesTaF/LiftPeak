import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {IUser, SocialMediaPlatform} from '@entities/user';
import { useProfileStore } from '../store';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useAnimatedScroll } from '@shared/components/AnimatedScrollContext';
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import { useQuery } from '@tanstack/react-query';
import { getAllWorkouts, getUserWorkouts, WorkoutPost } from '@features/feed';
import { useAuthStore } from '@features/auth';
import { getUserInfo } from '../api';



interface UserPostsProps {
    user: IUser;
}

export const UserPosts = ({user}: UserPostsProps) => {

    const {scrollY} = useAnimatedScroll();


    const {data: workouts} = useQuery({
        queryKey: ["profileFeed", user.id],
        queryFn: () => getUserWorkouts(user!.id)
    })



    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });


    return (
        <Animated.FlatList
        onScroll={scrollHandler}
        style={[defaultStyles.container]}
        // contentContainerStyle={{paddingBottom: tabBarHeight}}
        data={workouts}
        renderItem={({item}) => (
            <WorkoutPost workout={item} isViewable={true} />
        )}
        // refreshControl={
        //     <RefreshControl
        //         refreshing={refreshing}
        //         onRefresh={onRefresh}
        //     />
        // }
        keyExtractor={(item) => item.id!.toString()}
    />
    // workouts?.map((item) => {
    //     return (
    //         <WorkoutPost key={item.id} workout={item} isViewable={true} />
    //     )
    // })
    );
};
