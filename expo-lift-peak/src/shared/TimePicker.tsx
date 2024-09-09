import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { defaultStyles } from "@shared/styles";
import {IExerciseLog} from "@entities/workout-log";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";
import {getTimeObjFromSeconds} from "@shared/utils";

interface TimePickerProps {
    exerciseLog?: IExerciseLog;
    initValue: number;
    onChange: (value: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const seconds = Array.from({ length: 60 }, (_, i) => i);

const TimePicker = ({ exerciseLog, initValue, onChange}: TimePickerProps) => {
    const timePickerRef = useRef<BottomSheetModal>()
    const [selectedTime, setSelectedTime] = useState(getTimeObjFromSeconds(initValue));


    const handleChange = (newTime: any) => {
        setSelectedTime(newTime)

        onChange(newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds)
    }



    return (
        <>
            <TouchableOpacity onPress={() => timePickerRef.current?.present()}>
                    <Text style={defaultStyles.secondaryText}>
                        {`${selectedTime.hours}h ${selectedTime.minutes}m ${selectedTime.seconds}s`}
                    </Text>
            </TouchableOpacity>
            <TimePickerModal ref={timePickerRef as any} selectedTime={selectedTime} onChange={handleChange} handleClose={() => timePickerRef.current?.dismiss()} />
        </>
    );
};

interface TimePickerModalProps {
    handleClose: () => void;
    selectedTime: {
        hours: number,
        minutes: number;
        seconds: number
    }
    onChange: (prev: any) => void;
}

export const TimePickerModal = forwardRef<BottomSheetModal, TimePickerModalProps>(({handleClose, selectedTime, onChange}, ref) => {

    return (
        <CustomBottomSheet ref={ref as any} snapPoints={['50%']} handleClose={handleClose}>
            <TimePickerItem selectedTime={selectedTime} onChange={onChange} />
        </CustomBottomSheet>
    )
}
)

export default TimePicker;


export const TimePickerItem = ({selectedTime, onChange}: Omit<TimePickerModalProps, "handleClose">) => {
    const handleTimeChange = (type: string, value: number) => {
        const newTime = {
            ...selectedTime,
            [type]: value
        };

        onChange(newTime)
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {/* Hours Picker */}
            <Picker
                style={{
                    flex: 1,
                    width: "100%",
                    color: "white"
                }}
                selectedValue={selectedTime.hours}
                onValueChange={(itemValue) =>
                    handleTimeChange("hours", itemValue)
                }>
                {hours.map((hour, index) => (
                    <Picker.Item color={"white"} key={index + "_" + hour} label={`${hour} h`} value={hour} />
                ))}
            </Picker>

            {/* Minutes Picker */}
            <Picker
                style={{
                    flex: 1,
                    width: "100%",
                    color: "white"
                }}
                selectedValue={selectedTime.minutes}
                onValueChange={(itemValue) =>
                    handleTimeChange("minutes", itemValue)
                }>
                {minutes.map((minute, index) => (
                    <Picker.Item color={"white"} key={index + "_" + minute} label={`${minute} m`} value={minute} />
                ))}
            </Picker>

            {/* Seconds Picker */}
            <Picker
                style={{
                    flex: 1,
                    width: "100%",
                    color: "white"
                }}
                selectedValue={selectedTime.seconds}
                onValueChange={(itemValue) =>
                    handleTimeChange("seconds", itemValue)
                }>
                {seconds.map((second, index) => (
                    <Picker.Item color={"white"} key={index + "_" + second} label={`${second} s`} value={second} />
                ))}
            </Picker>
        </View>
    )
}