import React, {useRef, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {ExerciseCard, findExerciseList} from "@entities/exercise";
import {Colors, defaultStyles} from "@shared/styles";
import {useExerciseStore} from "@features/workout-logger";
import {Stack, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useLiveQuery} from "drizzle-orm/expo-sqlite";
import {db} from "@db/dbInstance";
import {exercise} from "@db/schema/exercises";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";
import CustomTabs from "@shared/components/tabs/CustomTabs";
import TabItem from "@shared/components/tabs/TabItem";
import Button from "@shared/components/Button";
import {MuscleFilter} from "@features/constructor";
import BottomSheetSelect from "@shared/components/BottomSheetSelect";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";
import {BottomSheetModal} from "@gorhom/bottom-sheet";


const Exercises = () => {
    const { data: offlineExercises } = useLiveQuery(db.select().from(exercise));
    const [value, setValue] = React.useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [filterMuscles, setFilterMuscles] = useState< {id: number, name: string}[]>([]);
    const router = useRouter()
    const filterRef = useRef<BottomSheetModal>(null);
    const {addExerciseLog, getOrder} = useExerciseStore()

    const {data} = useQuery({
        queryKey: ['exerciseList', value, filterMuscles],
        queryFn: async () => findExerciseList({search: value, muscles: filterMuscles.length ? filterMuscles.map(m => m.id).join(",") : ""}),
    })

    const [exercises, setExercises] = useState<typeof data>([])


    const handleFilterOpen = () => {
        filterRef.current?.present()
    }

    const handleFilterClose = () => {
        filterRef.current?.dismiss()
    }

    const isSelected = (exerciseId: number | string) => !!exercises?.find(e => e?.id === exerciseId);

    const manageExercise = (exerciseId: number | string) => {
       if(isSelected(exerciseId)) {
           setExercises((prev) => prev?.filter(ex => ex?.id !== exerciseId))
       } else {
           const selectedExercise = data?.find(e => e.id === exerciseId);
           if(selectedExercise) {
                setExercises((prev) => [...prev!, selectedExercise])
           }
       }
    }

    const confirmExercises = async () => {
        exercises?.forEach(exercise => {
            addExerciseLog({
                exercise: exercise,
                exerciseId: exercise.id,
                sets: [],
                previousSets: exercise.previousSets,
                order: getOrder(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        })
        router.back()
    }

    return (
        <>
        <Stack.Screen options={{
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: Colors.dark700
            },
            headerBackTitleVisible: false,
            headerTitle: "Exercises",
            headerRight: () => (
                <TouchableOpacity onPress={handleFilterOpen}>
                    <Ionicons name={"funnel-outline"} size={24} color={Colors.white} />
                </TouchableOpacity>
            )
        }} />
            <CustomTabs initialTab={"all"}>
                <TabItem name={"all"} label={"All"} activeTab={activeTab} onTabPress={setActiveTab}>
                    <View style={[defaultStyles.container, {paddingBottom: 0}]}>
                        {data ? <FlatList data={data}
                                          ListHeaderComponent={<View style={{height: 12}}></View>}
                                          renderItem={({item}) =>
                                              <ExerciseCard onPress={(exercise) => manageExercise(exercise.id)} exercise={item}
                                                            selected={isSelected(item.id)}/>
                                          }
                                          ListFooterComponent={<View style={{height: 12}}></View>}
                                          keyExtractor={(item) => item.id.toString()}
                        /> : (
                            <Text>
                                {JSON.stringify(offlineExercises)}
                            </Text>
                        )}
                    </View>
                </TabItem>
                <TabItem name={"selected"} label={"Selected"} activeTab={activeTab} onTabPress={setActiveTab}>
                    <View style={defaultStyles.container}>
                        {exercises?.length ? <FlatList data={exercises}
                                          renderItem={({item}) =>
                                              <ExerciseCard onPress={(exercise) => manageExercise(exercise.id)} exercise={item}
                                                            selected={isSelected(item.id)}/>
                                          }
                                          ItemSeparatorComponent={() => <View style={{height: 2, backgroundColor: Colors.dark300}}/>}
                                          keyExtractor={(item) => item.id.toString()}
                        /> : (
                            <Text style={{color: "white"}}>
                               No exercises selected
                            </Text>
                        )}
                    </View>
                </TabItem>
            </CustomTabs>
            <View style={{
                padding: 16,
                paddingBottom: 24,
                backgroundColor: Colors.dark700,
                flexDirection: "row",
                gap: 16,
                alignItems:"center"
            }}>
                <Text style={defaultStyles.secondaryText}>
                    {exercises?.length ? exercises.length : "No"} Exercises Selected
                </Text>
                <Button onPress={confirmExercises} color={"success"} title={"Add Exercises"}  style={{flex: 1}}/>
            </View>
            <CustomBottomSheet ref={filterRef} handleClose={handleFilterClose}  snapPoints={["50%", "90%"]}>
                <MuscleFilter selectedMuscles={filterMuscles} setSelectedMuscles={setFilterMuscles} />
            </CustomBottomSheet>
        </>
    );
};

export default Exercises;