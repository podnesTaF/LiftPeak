import React, {useCallback, useRef, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, ScrollView} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
import {
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetFooterProps,
    BottomSheetModal,
    BottomSheetView
} from "@gorhom/bottom-sheet";
import Button from "@shared/components/Button";
import {cutString} from "@shared/utils";

interface Option {
    label: React.ReactNode;
    value: string | number;
    icon?: React.ReactNode;
}

interface IBottomSheetSelectProps {
    label?: string;
    placeholder?: string;
    value: (string | number)[];
    options?: Option[];
    onChange?: (values: (string | number)[]) => void;
    multiple?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    last?: boolean;
    snapPoints?: (string | number)[];
    allAvailable?: boolean;
}

interface IBottomSheetItemProps {
    option: Option;
    selectedValues: (string | number)[];
    handleCheckboxChange: (value: string | number) => void;
}

// OptionItem Component
export const OptionItem = ({option, selectedValues, handleCheckboxChange}: IBottomSheetItemProps) => (
    <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => handleCheckboxChange(option.value)}
    >
        <View style={{flexDirection: "row", gap: 12, alignItems: "center"}}>
            {option.icon}
            <Text style={{color: 'white', fontSize: 16, fontWeight: "500", textTransform: 'capitalize'}}>{option.label}</Text>
        </View>
        <Checkbox
            value={selectedValues.includes(option.value)}
            onValueChange={() => handleCheckboxChange(option.value)}
            color={Colors.success}
            style={{ marginRight: 8 , borderRadius: 100, width: 24, height: 24}}
        />
    </TouchableOpacity>
);

// BottomSheetSelect Component
const BottomSheetSelect = ({label, placeholder, value, options, onChange, multiple, disabled, allAvailable, snapPoints, children, last}: IBottomSheetSelectProps)  => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedValues, setSelectedValues] = useState<(string | number)[]>(value || []);
    const handleClosePress = () => bottomSheetRef.current?.close();
    const handlePresentPress = () => bottomSheetRef.current?.present();

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop opacity={0.7} appearsOnIndex={0} disappearsOnIndex={-1} enableTouchThrough={false} {...props} />
        ),
        []
    );

    const renderFooter = useCallback(
        (props: BottomSheetFooterProps) => (
            <BottomSheetFooter {...props} bottomInset={32} style={{paddingHorizontal: 16, opacity: 0.7}}>
                <Button title={"Submit Selection"} color={"white"} onPress={handleClosePress} />
            </BottomSheetFooter>
        ),
        []
    );

    const handleCheckboxChange = (optionValue: string | number) => {
        if(!onChange) return;
        if (multiple) {
            const newSelectedValues = selectedValues.includes(optionValue)
                ? selectedValues.filter(val => val !== optionValue)
                : [...selectedValues, optionValue];

            if(optionValue === 'all'){
                setSelectedValues(options?.map(option => option.value) || []);
                onChange(options?.map(option => option.value) || []);

                return
            }

            setSelectedValues(newSelectedValues);

            onChange(newSelectedValues);
        } else {
            setSelectedValues([optionValue]);
            onChange([optionValue]);
            handleClosePress();
        }
    };

    return (
        <>
            <MockSelect label={label} last={last} value={value} placeholder={placeholder} onPress={handlePresentPress} />
            <BottomSheetModal
                footerComponent={renderFooter}
                backgroundStyle={{
                    backgroundColor: Colors.dark700,
                }}
                backdropComponent={renderBackdrop}
                ref={bottomSheetRef}
                handleIndicatorStyle={{
                    backgroundColor: 'white',
                }}
                index={1}
                enablePanDownToClose={true}
                snapPoints={snapPoints || ['60%', "80%"]}
            >
                <BottomSheetView style={{paddingVertical: 16, flex: 1}}>
                    {options && options.length > 0 ? (
                        <>
                            {allAvailable && (
                                <TouchableOpacity style={{marginBottom: 12, marginHorizontal: 16}} onPress={() => handleCheckboxChange("all")}>
                                    <Text style={defaultStyles.secondaryText}>
                                        Select All
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <ScrollView contentContainerStyle={{paddingHorizontal: 16}}>
                                {options.map((option, index) => (
                                    <OptionItem
                                        key={index}
                                        option={option}
                                        selectedValues={selectedValues}
                                        handleCheckboxChange={handleCheckboxChange}
                                    />
                                ))}
                            </ScrollView>
                        </>
                    ) : (
                        children
                    )}
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
};

interface ISelectProps {
    value: (string | number)[];
    placeholder?: string;
    onPress: () => void;
    label?: string;
    last?: boolean;
}

export const MockSelect = ({ label, value, placeholder, onPress, last}: ISelectProps) => {
    return (
        <View style={[defaultStyles.row, {paddingVertical: 16, borderBottomColor: Colors.dark500, borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth}]}>
            {label && (
                <Text style={[defaultStyles.smallTitle, {fontSize: 15, textTransform: "capitalize"}]}>
                    {label}
                </Text>
            )}
            <TouchableOpacity onPress={onPress} style={styles.inputContainer}>
                <Text style={[defaultStyles.secondaryText, {textTransform: "capitalize"}]}>
                    {cutString((value.length ? value.join(", ") : placeholder ? placeholder : "Select"), 20)}
                </Text>
                <Ionicons name={"chevron-forward"} size={24} color={Colors.dark300}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap:6,
    },
    optionContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        justifyContent: 'space-between'
    },
});

export default BottomSheetSelect;
