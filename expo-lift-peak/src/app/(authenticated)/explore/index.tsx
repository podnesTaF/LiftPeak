import React from 'react';
import {Dimensions, ScrollView, Text, View} from "react-native";
import {defaultStyles} from "@shared/styles";
import Button from "@shared/components/Button";
import {useQuery} from "@tanstack/react-query";
import {getRoutineList, RoutineCard} from "@entities/routine";
import {Link} from "expo-router";

const ExploreWorkouts = () => {
    const width = Dimensions.get('window').width;
    const {data: routines} = useQuery({
        queryKey: ['routineList'],
        queryFn: getRoutineList
    })

    return (
        <ScrollView style={defaultStyles.container} contentContainerStyle={{padding: 16}}>
            <View style={{marginBottom: 20, gap: 12}}>
                <Text style={[defaultStyles.header, {fontSize: 24}]}>
                    Workout Constructor
                </Text>
                <Text style={defaultStyles.secondaryText}>
                    Special for you and community workouts based on your preferences.
                </Text>
                <Link href={"/(authenticated)/constructor"} asChild style={{width: "100%"}}>
                    <Button title={"Generate Workouts"} color={"success"} fullWidth />
                </Link>
            </View>
            <View style={{marginBottom: 20, gap: 12}}>
                <Text style={[defaultStyles.header, {fontSize: 24}]}>
                    Popular Workouts
                </Text>
                <Text style={defaultStyles.secondaryText}>
                    Explore routines and workouts that fit you best!
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={width * 0.6} snapToAlignment={"center"} decelerationRate={"normal"} >
                    {routines?.map((routine) => (
                       <View key={routine.id} style={{width: width * 0.6, marginRight: 16}}>
                           <RoutineCard workout={routine} />
                       </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

export default ExploreWorkouts;