import React, {useRef, useState} from 'react';
import {Ionicons} from "@expo/vector-icons";
import {Keyboard, TouchableOpacity, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {Colors} from "@shared/styles";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import AttachWorkout from "@features/create-post/ui/AttachWorkout";
import {IWorkoutPreview} from "@features/workout";
import AttachExercise from "@features/create-post/ui/AttachExercise";
import {IExercise} from "@entities/exercise";
import {BlockType} from "@features/create-post/model";
import {TextType} from "@entities/post";
import {useRouter} from "expo-router";

interface PostAttachmentsProps {
    onAddBlock: (type: BlockType,insertAt: null | number, content?: string) => void;
    insertAt: number | null;
    setListMode: (enabled: boolean) => void;
    isListMode: boolean
}

const PostAttachments = ({onAddBlock,insertAt, setListMode, isListMode}: PostAttachmentsProps) => {
    const workoutAttachmentRef = useRef<BottomSheetModal>()
    const exerciseAttachmentRef = useRef<BottomSheetModal>()
    const router = useRouter();

    const toggleListMode = () => {
        setListMode(!isListMode);  // Notify parent about mode change
    };

    const openExerciseAttachment = () => {
        Keyboard.dismiss();
        exerciseAttachmentRef.current?.present();
    }

    const dismissExerciseAttachment = () => {
        exerciseAttachmentRef.current?.dismiss();
    }

    const openWorkoutAttachment = () => {
        Keyboard.dismiss();
        workoutAttachmentRef.current?.present();
    }

    const openPollEditor = () => {
        router.push({pathname: "/(authenticated)/create-post/poll-editor", params: {insertAt: insertAt || ""}})
    }

    const dismissWorkoutAttachment = () => {
        workoutAttachmentRef.current?.dismiss();
    }

    const insertImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if(!result.canceled && result.assets?.[0].uri) {
            onAddBlock("image", insertAt, result.assets[0].uri);
        }
    };

    const onAttachWorkout = (workout: IWorkoutPreview) => {
        onAddBlock("workout", insertAt ? insertAt + 1 : null, JSON.stringify(workout));
        dismissWorkoutAttachment();
    }

    const onAttachExercise = (exercise: IExercise) => {
        onAddBlock("exercise", insertAt ? insertAt + 1 : null, JSON.stringify(exercise));
        dismissExerciseAttachment();
    }

    return (
        <>
            <View style={{backgroundColor: Colors.dark700,flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 16, padding: 16, paddingBottom: 32}}>
                <View style={{flexDirection: "row", gap: 16}}>
                    <TouchableOpacity onPress={insertImage}>
                        <Ionicons name={"image-outline"} size={30} color={Colors.dark300} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openExerciseAttachment}>
                        <Ionicons name={"barbell"} size={30} color={Colors.dark300} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openWorkoutAttachment}>
                        <Ionicons name={"list"} size={30} color={Colors.dark300} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openPollEditor}>
                        <Ionicons name={"bar-chart-outline"} size={30} color={Colors.dark300} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleListMode}>
                        <Ionicons name={isListMode ? "list-circle" : "list-circle-outline"} size={30} color={isListMode ? Colors.success : Colors.dark300}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => onAddBlock(TextType.TEXT, insertAt)} style={{marginLeft: 5}}>
                    <Ionicons name="add-circle" size={30} color="white"/>
                </TouchableOpacity>
            </View>
            <AttachWorkout ref={workoutAttachmentRef as any} onAdd={onAttachWorkout} />
            <AttachExercise ref={exerciseAttachmentRef as any} onAdd={onAttachExercise} />
        </>
    );
};

export default PostAttachments;