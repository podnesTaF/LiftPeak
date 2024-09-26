import React from 'react';
import {View, StyleSheet, Text, Image} from "react-native";
import {Colors} from "@shared/styles";
import {getContrastColor} from "@shared/utils";

interface AvatarProps {
    size?: number;
    name?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
    url?: string | null
    borderRadius?: number
}

const Avatar = ({url, size = 40, name, backgroundColor = Colors.dark300, borderRadius, children}: AvatarProps) => {
    return (
        url ? (
            <Image
                style={[styles.container, {width: size, height: size, borderRadius: borderRadius || (size / 2)}]}
                source={{uri: url}}
            />
        ) : (
            <View style={[styles.container, {backgroundColor: backgroundColor, width: size, height: size, borderRadius: borderRadius || (size / 2)}]}>
                {name ? (
                    <Text style={[styles.title, {color: getContrastColor(backgroundColor)}]}>
                        {name}
                    </Text>
                ) : children}

            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textTransform: "uppercase",
    },
});

export default Avatar;