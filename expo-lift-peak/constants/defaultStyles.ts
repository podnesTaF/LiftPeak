import {Colors} from "@/constants/Colors";
import {StyleSheet} from "react-native";

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark900,
        padding: 16,
    },
    horizontalContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6
    }
})