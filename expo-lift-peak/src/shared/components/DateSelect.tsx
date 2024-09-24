import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
  } from "react-native";
  import React, { useRef, useState } from "react";
  import DateTimePicker, {
    DateTimePickerEvent,
  } from "@react-native-community/datetimepicker";
  import CustomBottomSheet from "./bottomSheet/CustomBottomSheet";
  import { Ionicons } from "@expo/vector-icons";
  import { Colors } from "@shared/styles";
  import { BottomSheetModal } from "@gorhom/bottom-sheet";
  
  interface BirthdateSelectorProps {
    label?: string;
    onSelect: (date: string) => void;
    value?: string | null;
  }
  
  const DateSelect: React.FC<BirthdateSelectorProps> = ({
    label,
    onSelect, value
  }) => {
  
    const [tempDate, setTempDate] = useState<Date | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(
        value
        ? new Date(value).toISOString().split("T")[0]
        : null
    );
  
    const bottomSheetRef = useRef<BottomSheetModal>(null);
  
    const openBottomSheet = () => {
      const dateToSet = selectedDate
        ? new Date(selectedDate)
        : new Date();
      setTempDate(dateToSet);
      bottomSheetRef.current?.present();
    };
  
    const handleConfirmSelection = () => {
      if (tempDate) {
        const formattedDate = tempDate.toISOString().split("T")[0]; 
        setSelectedDate(formattedDate);
        onSelect(formattedDate); 
      }
      bottomSheetRef.current?.dismiss();
    };
  
    const onDateChange = (
        _: DateTimePickerEvent,
      date?: Date | undefined
    ) => {
      if (date) {
        setTempDate(date);
      }
    };
  
    return (
      <View>
        <View style={{ gap: 8 }}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TouchableOpacity onPress={openBottomSheet} style={styles.inputWrapper}>
            <Text style={{ color: Colors.dark300, fontSize: 18 }}>
              {selectedDate ?? "Select your birthdate"}
            </Text>
            <Ionicons
              name={"chevron-forward-sharp"}
              size={24}
              color={Colors.dark300}
            />
          </TouchableOpacity>
        </View>
        <CustomBottomSheet
          ref={bottomSheetRef}
          handleClose={handleConfirmSelection}
          snapPoints={["43%", "90%"]}
          buttonName="Confirm"
          buttonStyle={{ opacity: 1, paddingHorizontal: 20 }}
        >
          <View>
            <View
              style={{
                borderBottomWidth: 2,
                borderColor: Colors.dark500,
                paddingBottom: 20,
              }}
            >
              <Text
                style={{
                  color: Colors.dark100,
                  fontSize: 20,
                  fontWeight: "400",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                Select Birthdate
              </Text>
            </View>
  
            <DateTimePicker
              mode="date"
              value={tempDate || new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              textColor={"white"}
              style={styles.datePicker}
            />
          </View>
        </CustomBottomSheet>
      </View>
    );
  };
  
  export default DateSelect;
  
  const styles = StyleSheet.create({
    inputWrapper: {
      borderRadius: 8,
      backgroundColor: Colors.dark500,
      color: Colors.white,
      paddingVertical: 12,
      paddingHorizontal: 12,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    label: {
      color: Colors.dark300,
      fontSize: 16,
    },
    datePicker: {
      marginTop: 10,
      color: "white"
    },
  });
  