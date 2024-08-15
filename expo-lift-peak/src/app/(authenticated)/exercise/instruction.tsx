import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {getFullExercise} from "@entities/exercise";
import {useGlobalSearchParams, useLocalSearchParams} from "expo-router";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {Colors, defaultStyles} from "@shared/styles";
import {ExerciseMedia} from "@entities/media";
import {Text, View} from "react-native";
import {groupByPriority} from "@features/muscles";

const Instruction = () => {
    const {id} = useGlobalSearchParams<{id: string}>()
    const {scrollY} = useAnimatedScroll();

    const {data: exercise, isLoading} = useQuery({
        queryKey: ['exercise', id],
        queryFn: async () => await getFullExercise(+id),
        retry: 2,
        retryDelay: 5000
    })

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    })

    return (
        <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} style={[defaultStyles.container]}>
            {/*<ExerciseMedia mediaFiles={exercise?.mediaFiles} isLoading={isLoading} />*/}
            <View style={{gap: 16, padding: 16}}>
                <View style={{gap: 4}}>
                    <Text style={[defaultStyles.smallTitle, {paddingBottom: 8}]}>
                        Muscle Group Targeted
                    </Text>
                    {!isLoading && groupByPriority(exercise?.exerciseTargets)?.entries.map(([groupName, exerciseTargets], index) => (
                        <View key={groupName} style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                            <Text style={[defaultStyles.secondaryText, {color: "white"}]}>
                                {groupName}:
                            </Text>
                            <Text style={defaultStyles.secondaryText}>
                                {exerciseTargets?.map(exerciseTarget => exerciseTarget.target?.name).join(", ")}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{gap: 16, padding: 16}}>
                <View style={{gap: 4}}>
                    <Text style={[defaultStyles.smallTitle, {paddingBottom: 8}]}>
                        Instructions
                    </Text>
                    {!isLoading && exercise?.instructions.map((instruction, index) => (
                        <View key={instruction.id} style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                            <Text style={defaultStyles.secondaryText}>
                                {index + 1}.
                            </Text>
                            <Text style={defaultStyles.secondaryText}>
                                {instruction.content}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{height: 1000}}>

            </View>
        </Animated.ScrollView>
    );
};

export default Instruction;