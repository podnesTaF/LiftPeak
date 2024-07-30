import React from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Colors} from "@shared/styles";

interface AvatarProps {
    size?: number;
    name: string;
    backgroundColor?: string;
}

const Avatar = ({size, name, backgroundColor}: AvatarProps) => {
    return (
        <View style={[styles.container, {backgroundColor: backgroundColor ?? Colors.dark300}]}>
            <Text style={styles.title}>
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
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Avatar;