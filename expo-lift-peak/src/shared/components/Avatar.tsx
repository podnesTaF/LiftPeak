import React from 'react';
import {View, StyleSheet, Text, Image} from "react-native";
import {Colors} from "@shared/styles";
import {getContrastColor} from "@shared/utils";

interface AvatarProps {
    size?: number;
    name?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
    url?: string;
}

const Avatar = ({url, size = 40, name, backgroundColor = Colors.dark300, children}: AvatarProps) => {
    return (
        url ? (
            <Image
                style={[styles.container, {width: size, height: size, borderRadius: size / 2}]}
                source={{uri: url}}
            />
        ) : (
            <View style={[styles.container, {backgroundColor: backgroundColor, width: size, height: size}]}>
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
        borderRadius: 10000,
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