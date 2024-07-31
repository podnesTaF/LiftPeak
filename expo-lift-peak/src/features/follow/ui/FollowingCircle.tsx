import React from 'react';
import Avatar from "@shared/components/Avatar";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Colors} from "@shared/styles";

interface FollowingCircleProps {
    imageUrl?: string;
    isOnline?: boolean;
    onPress: () => void;
    isActive?: boolean;
    activeSelected?: boolean;
}

const FollowingCircle = ({imageUrl, isOnline, onPress, isActive, activeSelected = false}: FollowingCircleProps) => {
    const highlighted = (activeSelected && isActive) || !activeSelected;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, {opacity: highlighted ? 1 : 0.5}]}>
            {imageUrl ? <Image source={{uri: imageUrl}} style={{width: "100%", height: "100%", borderRadius: 100}}/> : <Avatar name={"KV"} size={65} />}
            {isOnline && <View style={styles.onlineCircle}></View>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        height: 65,
        position: "relative"
    },
    onlineCircle: {
        width: 14,
        height: 14,
        borderRadius: 100,
        backgroundColor: Colors.lime,
        position: "absolute",
        right: 4,
        bottom: 4
    }
});

export default FollowingCircle;