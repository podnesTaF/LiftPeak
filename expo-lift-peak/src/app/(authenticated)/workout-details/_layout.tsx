import React from 'react';
import {Stack, useLocalSearchParams} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {getWorkoutDetails} from "@features/workout";
import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {format} from "date-fns";
import {PostActions} from "@features/feed/ui/WorkoutPost";
import {BlurView} from "expo-blur";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from '@shared/components/navigation/MaterialTopTabs';
import {CommentType} from "@entities/reaction";

const Layout = () => {
    const {id} = useLocalSearchParams<{ id: string }>()

    const {data: workout} = useQuery({
        queryKey: ["workout", id],
        queryFn: async () => getWorkoutDetails(id!),
        enabled: !!id,
    })

    return (
        <>
            <Stack.Screen
                options={{
                    header: ({navigation}) => (
                        <SafeAreaView style={{backgroundColor: Colors.dark700}}>
                            <View style={{paddingVertical: 10, paddingHorizontal: 12, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: Colors.dark700, zIndex: 10}}>
                                <View style={{position:"absolute", top: 12, left: 12}}>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Ionicons name={'chevron-back'} size={30} color={Colors.white}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={[{flex: 1,alignItems: "center", opacity: 0, zIndex: 10}]}>
                                    <Text style={{color: Colors.dark300, fontWeight: "600", fontSize: 16}}>
                                        Workout Details
                                    </Text>
                                </View>
                            </View>
                            <View style={[{padding: 12, gap: 12 }]}>
                                <Text style={[defaultStyles.header, {fontSize: 24}]}>
                                    {workout?.title}
                                </Text>
                                <Text style={[defaultStyles.secondaryText, {textTransform: "capitalize"}]}>
                                    {workout && format(new Date(workout.createdAt), 'EEEE · MMM d · yyyy · HH:mm')}
                                </Text>
                            </View>
                        </SafeAreaView>
                    )
                }}
            />
                <CustomTopTabBar>
                    <MaterialTopTabs.Screen name={'index'} initialParams={{
                        workoutId: id
                    }} options={{
                        title: "post & Stats"
                    }} />
                    <MaterialTopTabs.Screen  name={'exercises'} initialParams={{
                        workoutId: id
                    }}  options={{
                        title: "Exercises"
                    }} />
                </CustomTopTabBar>
            {workout && (
                <BlurView intensity={50} tint={"dark"} style={{padding: 12, backgroundColor: Colors.dark700, paddingBottom: 32}}>
                    <PostActions item={workout} type={CommentType.WORKOUT_POST} />
                </BlurView>
            )}
        </>
    );
};

export default Layout;