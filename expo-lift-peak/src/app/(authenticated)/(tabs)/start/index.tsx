import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Button from "@shared/components/Button";
import {Link, Stack, useRouter} from "expo-router";
import React, {useEffect, useLayoutEffect} from "react";
import {useExerciseStore, useWorkoutStore} from "@features/workout-logger";
import {Colors, defaultStyles} from "@shared/styles";
import {useHeaderHeight} from "@react-navigation/elements";
import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "@tanstack/react-query";
import {getRoutineList, RoutineCard} from "@features/workout";
import {useAuthStore} from "@features/auth";
import {registerBackgroundTask, useTimerStore} from "@features/timer";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";



export default function StartWorkout() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const {user} = useAuthStore()
  const {workout, initializeWorkout, clearWorkout} = useWorkoutStore();
  const {
    startTimer,
      clearTimer
  } = useTimerStore();
  const tabBarHeight = useBottomTabBarHeight() + 20;
  const {
    clearExercises
  } = useExerciseStore()

  const {data} = useQuery({
    queryKey: ['workoutRoutines'],
    queryFn: getRoutineList,
    retry: 3,
    retryDelay: failureCount => Math.min(1000 * 2 ** failureCount, 30000),
  })

  const startQuickWorkout = () => {
    if(workout) {
      Alert.alert("You have a workout in progress", "Starting a new workout will discard the current one.", [
        {
          text: "Keep Current",
          style: "cancel",
          onPress: () => {
            router.push("/(authenticated)/workout");
          }
        },
        {
          text: "Create New",
          style: "destructive",
          onPress: () => {
            discardWorkout()
            startNewWorkout()
          }
        }
      ])
    } else {
       startNewWorkout()
    }
  }

  const startNewWorkout = () => {
    if(!user) return;
    initializeWorkout({userId: user.id})
    registerBackgroundTask();
    startTimer();
    router.push("/(authenticated)/workout");
  }

  const discardWorkout = () => {
    clearTimer();
    clearWorkout();
    clearExercises();
  }


  return (
      <>
        <Stack.Screen options={{
          title: "Start a workout",
          headerTransparent: true,
          headerLargeTitle: true,
          headerTintColor: "#fff",
          headerLargeTitleStyle: {
            color: "#fff",
            fontSize: 24,
            fontWeight: "700"
          },
          headerStyle: {
            backgroundColor: Colors.dark900,
          },
          headerLargeTitleShadowVisible: false,
        }} />
        <ScrollView contentContainerStyle={{paddingTop: headerHeight + 20, paddingBottom: tabBarHeight}} style={[defaultStyles.container, {padding: 16}]}>
          <View style={styles.subtitleContainer}>
            <Text style={defaultStyles.secondaryText}>Explore routines and workouts that fit you best!</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title={"Quick Start"} onPress={startQuickWorkout} color={"white"}>
              <Ionicons name={"flash-outline"} size={24} color={Colors.dark700} />
            </Button>
            <Button title={"Explore Workouts"} onPress={() => router.push("/(authenticated)/muscle-filter")} color={"dark500"}>
              <Ionicons name={"search-outline"} size={24} color={Colors.white} />
            </Button>
            <Button title={"Explore Workouts"} onPress={() => router.push({pathname: "/(authenticated)/exercise", params: {id: 17}})} color={"dark500"}>
              <Ionicons name={"search-outline"} size={24} color={Colors.white} />
            </Button>
          </View>
          <View style={{flexDirection: "row", gap:12, justifyContent: "space-between", alignItems: "center", paddingVertical: 12, width: "100%"}}>
            <View style={{flexDirection: "row", gap: 10, alignItems: 'center'}}>
              <Ionicons name={"bookmark-outline"} size={24} color={Colors.white} />
              <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>2 saved workouts</Text>
            </View>
            <Button title={"Add New"} color={"success"}>
              <Ionicons name={"add"} size={24} color={Colors.white} />
            </Button>
          </View>
          <View style={{gap: 16, marginVertical: 16}}>
            {data?.map((routine) => (
                <RoutineCard workout={routine} key={routine.id} />
            ))}
          </View>
        </ScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 16,
    gap: 10,
    width: "100%"
  },
  subtitleContainer: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryText: {

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
