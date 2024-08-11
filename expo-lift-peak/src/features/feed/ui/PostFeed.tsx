import React from 'react';
import {View} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {getAllWorkouts} from "@features/feed/api";
import WorkoutPost from "./WorkoutPost";

export const PostFeed = () => {

    const {data: workouts} = useQuery({
        queryKey: ["workouts"],
        queryFn: getAllWorkouts,
    })

    return (
        <View>
            {workouts?.map(workout => (
                <WorkoutPost key={workout.id} workout={workout} />
            ))}
        </View>
    );
};

export default PostFeed;