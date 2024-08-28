import React from "react";
import {StyleSheet, TextInput, View, Keyboard, TouchableOpacity, Dimensions} from "react-native";
import {Feather, Entypo, Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import Animated, {interpolate, useAnimatedStyle, withTiming} from "react-native-reanimated";
import Button from "@shared/components/Button";

interface SearchBarProps {
    clicked: boolean;
    searchPhrase: string;
    setSearchPhrase: (text: string) => void;
    setClicked: (clicked: boolean) => void;
}

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked }: SearchBarProps) => {
    const { width } = Dimensions.get("window");
    const smallInputWidth = width - 100;
    const largeInputWidth = width - 24;
    const animatedInputStyle = useAnimatedStyle(() => {
        const width = withTiming(interpolate(+clicked, [0, 1], [largeInputWidth, smallInputWidth]), {duration: 200});
        return {
            width: width,
        };
    })

    return (
        <View style={styles.container}>
            <Animated.View style={[clicked ? styles.searchBar__clicked : styles.searchBar__unclicked, animatedInputStyle]}>
                <Ionicons name="search-outline" size={24} color={Colors.dark300} />
                <TextInput
                    autoComplete={"off"}
                    style={styles.input}
                    placeholder="Search"
                    value={searchPhrase}
                    onChangeText={setSearchPhrase}
                    onFocus={() => {
                        setClicked(true);
                    }}
                />

                {clicked && (
                    <TouchableOpacity onPress={() => {
                        setSearchPhrase("");
                    }}>
                        <Ionicons
                            name="close-outline"
                            size={24}
                            color={Colors.dark300}
                        />
                    </TouchableOpacity>
                )}
            </Animated.View>

            {clicked && (
                <View>
                    <Button
                        title="Cancel"
                        color={"transparent"}
                        onPress={() => {
                            Keyboard.dismiss();
                            setClicked(false);
                        }} />
                </View>
            )}
        </View>
    );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "100%"
    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        backgroundColor: Colors.dark500,
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        backgroundColor: Colors.dark500,
        borderRadius: 15,
        alignItems: "center",
    },
    input: {
        fontSize: 20,
        paddingHorizontal: 12,
        width: "85%",
        color: "white"
    },
});