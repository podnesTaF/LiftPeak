import React from 'react';
import Animated, {useAnimatedProps, useSharedValue} from "react-native-reanimated";
import {G, Path} from "react-native-svg";
import {Colors} from "@shared/styles";


const AnimatedG = Animated.createAnimatedComponent(G);


interface MuscleGroupProps {
    paths: string[];
    muscleGroupName: string;
    selectedMuscles: string[]
    setSelectedMuscles: (muscles: string[]) => void;
}

const MuscleGroup = ({paths, muscleGroupName, selectedMuscles, setSelectedMuscles}: MuscleGroupProps) => {
    const opacity = useSharedValue(1);

    const animatedProps = useAnimatedProps(() => ({
        opacity: opacity.value,
    }));

    const handlePress = () => {
        if (selectedMuscles.includes(muscleGroupName)) {
            setSelectedMuscles(selectedMuscles.filter(muscle => muscle !== muscleGroupName));
        } else {
            setSelectedMuscles([...selectedMuscles, muscleGroupName]);
        }
    }

    return (
        <AnimatedG animatedProps={animatedProps} onPress={handlePress}>
            {paths.map((path, index) => (
                <Path key={index} d={path} fill={selectedMuscles.includes(muscleGroupName) ? Colors.success : Colors.dark300} />
                ))}
        </AnimatedG>
    );
};

export default MuscleGroup;