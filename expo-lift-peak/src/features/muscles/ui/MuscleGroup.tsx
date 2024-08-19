import React from 'react';
import Animated, {useAnimatedProps, useSharedValue} from "react-native-reanimated";
import {G, Path} from "react-native-svg";
import {Colors} from "@shared/styles";
import {ITarget} from "@entities/exercise";


const AnimatedG = Animated.createAnimatedComponent(G);


interface MuscleGroupProps {
    muscle: ITarget;
    paths: string[];
    setSelectedMuscles: (muscles: {id: number, name: string}[]) => void;
    selectedMuscles: {id: number, name: string}[];
}

const MuscleGroup = ({muscle, selectedMuscles, setSelectedMuscles, paths}: MuscleGroupProps) => {
    const opacity = useSharedValue(1);

    const animatedProps = useAnimatedProps(() => ({
        opacity: opacity.value,
    }));

    const handlePress = () => {
        if (selectedMuscles.find(m => m.id === muscle.id)) {
            setSelectedMuscles(selectedMuscles.filter(m => m.id !== muscle.id));
        } else {
            setSelectedMuscles([...selectedMuscles, {name: muscle.name, id: muscle.id}]);
        }
    }

    return (
        <AnimatedG animatedProps={animatedProps} onPress={handlePress}>
            {paths.map((path, index) => (
                <Path key={index} d={path} fill={selectedMuscles.find(m => m.id === muscle.id) ? Colors.success : Colors.dark300} />
                ))}
        </AnimatedG>
    );
};

export default MuscleGroup;