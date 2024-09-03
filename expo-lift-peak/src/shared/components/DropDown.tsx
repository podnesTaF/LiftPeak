import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";
import { Controller, useFormContext } from "react-hook-form";

type OptionItem = {
  value: string;
  label: string;
};

interface DropDownProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  placeholder: string;
  label?: string;
  name: string
}

export default function Dropdown({
  data,
  onChange,
  placeholder,
  label,
  name
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);
  const buttonRef = useRef<View>(null);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);

  const toggleExpanded = useCallback(() => {

    // Dismiss the keyboard whenever the dropdown is expanded
    if (!expanded) {
      Keyboard.dismiss();
    }
    setExpanded(!expanded);
  }, [expanded]);

  const onSelect = useCallback((item: OptionItem) => {
    onChange(item);
    setExpanded(false);
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        const finalValue = py + height + (Platform.OS === "android" ? -32 : 3);
        setTop(finalValue);
        setWidth(width);
      });
    }
  }, [expanded]);

  const {
    control,
    formState: {errors},
  } = useFormContext()

  return (
    <Controller
    control={control}
    name={name}
    render={({field: {onChange, onBlur, value}}) => 
    <View style={{ gap: 8 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View ref={buttonRef} style={{}}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={toggleExpanded}
        >
          <Text style={styles.text}>{value || placeholder}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={Colors.dark300}
          />
        </TouchableOpacity>
        {expanded ? (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View style={styles.backdrop}>
                <View
                  style={[
                    styles.options,
                    {
                      top,
                      width: width,
                    },
                  ]}
                >
                  <FlatList
                    keyExtractor={(item) => item.value}
                    data={data}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.optionItem}
                        onPress={() => {onSelect(item); onChange(item.label)}}
                      >
                        <Text style={styles.flatText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : null}
      </View>
    </View>
    }
    />
  );
}

const styles = StyleSheet.create({
  flatText: {
    color: Colors.white,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  backdrop: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  optionItem: {
    height: 40,
    justifyContent: "center",
  },
  separator: {
    height: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark500,
  },
  options: {
    position: "absolute",
    backgroundColor: Colors.dark700,
    padding: 10,
    borderRadius: 6,
    maxHeight: 250,
  },
  text: {
    fontSize: 18,
    color: Colors.dark300,
  },
  button: {
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    minHeight: 48,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
});
