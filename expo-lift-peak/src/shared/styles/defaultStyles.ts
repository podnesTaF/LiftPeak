import {Colors} from "@shared/styles/Colors"
import {StyleSheet} from "react-native";

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark900,
        paddingBottom: 100
    },
    horizontalContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6
    },
    header: {
        fontSize: 32,
        fontWeight: "700",
        color: "white",
    },
    secondaryText: {
        fontSize: 15,
        color: Colors.dark300,
        fontWeight: "500"
    },
    smallTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})