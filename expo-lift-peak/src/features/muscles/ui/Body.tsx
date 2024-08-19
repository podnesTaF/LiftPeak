import React from 'react';
import {Dimensions} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {bodyShape} from "@features/muscles/utils/muscles";
import {Colors} from "@shared/styles";
import MuscleGroup from "@features/muscles/ui/MuscleGroup";
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import {useQuery} from "@tanstack/react-query";
import {getMusclesWithVectors} from "@features/muscles/api/MuscleApi";
import {filterMusclesByLook} from "@features/muscles/utils";

interface BodyProps {
    look: "front" | "back";
    setSelectedMuscles: (muscles: {id: number, name: string}[]) => void;
    selectedMuscles: {id: number, name: string}[];
}

export const Body = ({look, selectedMuscles, setSelectedMuscles}: BodyProps) => {
    const {height, width} = Dimensions.get('window');

    const {data} = useQuery({
        queryKey: ["muscles"],
        queryFn: getMusclesWithVectors
    })

    const aspectRatio = 500 / 400;


    return (
        <ReactNativeZoomableView maxZoom={2}
                                 minZoom={0.7}
                                 initialZoom={0.8}
                                 bindToBorders={true}
                                 style={[{alignItems: "center", justifyContent: "center"}]}>
            <Svg
                width={width * 0.68}
                height={(height * 0.9) / aspectRatio}
                preserveAspectRatio="xMidYMid meet"
            >
                <Path
                    d={bodyShape[look]?.path}
                    fill={Colors.dark500}
                />
                {filterMusclesByLook(look, data).map((m, index) => (
                    <MuscleGroup
                        key={index}
                        paths={m.paths![look]!}
                        muscle={m}
                        selectedMuscles={selectedMuscles}
                        setSelectedMuscles={setSelectedMuscles}
                    />
                ))}
            </Svg>
        </ReactNativeZoomableView>
    );
};