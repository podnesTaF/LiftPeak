import React from 'react';
import {Dimensions} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {bodyShape} from "@features/muscles/utils/muscles";
import {Colors} from "@shared/styles";
import MuscleGroup from "@features/muscles/ui/MuscleGroup";
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';

interface BodyProps {
    look: "front" | "back";
    setSelectedMuscles: (muscles: string[]) => void;
    selectedMuscles: string[];
}

export const Body = ({look, selectedMuscles, setSelectedMuscles}: BodyProps) => {
    const {height, width} = Dimensions.get('window');
    const aspectRatio = 500 / 400;


    return (
        <ReactNativeZoomableView maxZoom={2}
                                 minZoom={0.7}
                                 initialZoom={1}
                                 bindToBorders={true}
                                 style={[{alignItems: "center", justifyContent: "flex-start"}]}>
            <Svg
                width={width * 0.68}
                height={(height * 0.8) / aspectRatio}
                preserveAspectRatio="xMidYMid meet"
            >
                <Path
                    d={bodyShape[look]?.path}
                    fill={Colors.dark500}
                />
                {Object.entries(bodyShape[look]?.muscles).map(([groupName, value], index) => (
                    <MuscleGroup
                        key={index}
                        paths={value.paths}
                        muscleGroupName={groupName}
                        selectedMuscles={selectedMuscles}
                        setSelectedMuscles={setSelectedMuscles}
                    />
                ))}
            </Svg>
        </ReactNativeZoomableView>
    );
};