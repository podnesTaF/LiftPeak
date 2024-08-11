import React from 'react';
import Avatar from "@shared/components/Avatar";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "@shared/styles";

interface FollowingCircleProps {
    imageUrl?: string;
    isOnline?: boolean;
    onPress: () => void;
    isActive?: boolean;
    activeSelected?: boolean;
    username?: string;
}

const FollowingCircle = ({imageUrl, username, isOnline, onPress, isActive, activeSelected = false}: FollowingCircleProps) => {
    const highlighted = (activeSelected && isActive) || !activeSelected;

    return (
        <View style={{opacity: highlighted ? 1 : 0.5,alignItems: "center", gap: 8, justifyContent: "center"}}>
            <TouchableOpacity onPress={onPress} style={[styles.container]}>
                {imageUrl ? <Image source={{uri: imageUrl}} style={{width: "100%", height: "100%", borderRadius: 100}}/> : <Avatar name={"KV"} size={69} />}
                {isOnline && <View style={styles.onlineCircle}></View>}
            </TouchableOpacity>
            <Text lineBreakMode={"clip"} style={{color: "white", fontSize: 12, fontWeight: "600"}}>
                {username}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        width: 69,
        height: 69,
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