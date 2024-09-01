import React from 'react';
import {FlatList, View} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {getAllWorkouts} from "@features/feed/api";
import WorkoutPost from "./WorkoutPost";
import FollowingCircles from "@features/follow/ui/FollowingCircles";

export const PostFeed = () => {

    const {data: workouts} = useQuery({
        queryKey: ["workouts"],
        queryFn: getAllWorkouts,
    })



    return (
        <FlatList
            data={workouts}
            ListHeaderComponent={<FollowingCircles/>}
            renderItem={({item}) => (
                <WorkoutPost  workout={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};

export default PostFeed;