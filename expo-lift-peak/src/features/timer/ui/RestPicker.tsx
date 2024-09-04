import React, {useState} from 'react';
import {Text, View} from "react-native";
import {IExerciseLog} from "@entities/workout-log";
import {defaultStyles} from "@shared/styles";
import {Picker} from '@react-native-picker/picker';
import {formatTime} from "@shared/utils";

interface RestPickerProps {
    exerciseLog: IExerciseLog;
    selectedTime: number,
    setSelectedTime: Function;
}

const timesInSeconds = Array.from({ length: 61 }, (_, i) => i * 5);

const RestPicker = ({exerciseLog, setSelectedTime, selectedTime}: RestPickerProps) => {

    return (
        <View style={{
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
            gap: 12
        }}>
            <Text style={defaultStyles.smallTitle}>
                Rest Time for {exerciseLog.exercise?.name}
            </Text>
            <Picker
                style={{
                    flex: 1,
                    width: "100%",
                    color: "white"
                }}
                selectedValue={selectedTime}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedTime(itemValue)
                }>
                {timesInSeconds.map((time, index) => (
                    <Picker.Item color={"white"} key={index + "_"+time} label={time === 0 ? "No Rest" : formatTime(time)} value={time} />
                ))}
            </Picker>
        </View>
    );
};

export default RestPicker;