import React from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Colors} from "@shared/styles";
import {getContrastColor} from "@shared/utils";

interface AvatarProps {
    size?: number;
    name?: string;
    backgroundColor?: string;
}

const Avatar = ({size = 40, name, backgroundColor =  Colors.dark300}: AvatarProps) => {
    return (
        <View style={[styles.container, {backgroundColor: backgroundColor,  width: size, height: size}]}>
            <Text style={[styles.title, {color: getContrastColor(backgroundColor)}]}>
                {name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4
    },
    title: {
        fontSize: 16,
        fontWeight: "semibold",
        textTransform: "uppercase",
    },
});

export default Avatar;