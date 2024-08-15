import React from 'react';
import {Image, TouchableOpacity, View, StyleSheet} from "react-native";
import {IExerciseMedia, MediaType} from "@entities/media/model";
import {Colors} from "@shared/styles";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {Color} from "ansi-fragments/build/fragments/Color";

interface ImagePreviewProps {
    media: IExerciseMedia;
    onPress?: (index: number) => void;
    index?: number;
    active?: boolean;
}
export const ImagePreview = ({media, onPress, index, active}: ImagePreviewProps) => {
    const mediaIcon = media.mediaType === MediaType.Video ? (
        <MaterialIcons name={"movie"} color={Colors.dark300} size={24} />
    ) : (
        <Ionicons name={"image-outline"} color={Colors.dark300} size={24} />
    )

    return (
        <TouchableOpacity style={[styles.container, {borderWidth: active ? 2 : 0, opacity: active ? 1 : 0.7}]} onPress={() => onPress(index)}>
            {media.previewUrl ? (
                <Image source={{uri: media.previewUrl}} style={{width: "100%", height: "100%"}} />
            ) : (
                <View style={[styles.container, {backgroundColor: Colors.dark700}]}>
                </View>
            )}
            <View style={{position: "absolute", right: 5, bottom: 5}}>
                {mediaIcon}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 80,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        opacity: 0.9,
        justifyContent: "center",
        alignItems: "center",
        borderColor: Colors.lime
    }
})