import React from 'react';
import {IExerciseMedia, MediaType} from "@entities/media/model";
import {ExerciseVideo} from "@entities/exercise/ui";
import {Image, View} from "react-native";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {ImagePreview} from "./ImagePreview";

interface ExerciseMediaProps {
    mediaFiles?: IExerciseMedia[];
    isLoading?: boolean;
}

export const ExerciseMedia = ({mediaFiles, isLoading}: ExerciseMediaProps) => {
    const [activeVideo, setActiveVideo] = React.useState<number>(0);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const switchVideo = (index: number) => {
        opacity.value = withTiming(0.2, { duration: 300 }, () => {
            runOnJS(setActiveVideo)(index);
            opacity.value = withTiming(1, { duration: 300 });
        });
    };

    if(!isLoading && (!mediaFiles || !mediaFiles.length)) return null;

    return (
        <Animated.View  style={[animatedStyle]}>
            {mediaFiles?.map((media, index) => (
                media.mediaType === MediaType.Video ? (
                    <ExerciseVideo key={media.id} url={media.mediaUrl} hide={index !== activeVideo} />
                ) : (
                    <Image key={media.id} source={{uri: media.mediaUrl}} style={{width: "100%", height: 300, display:index !== activeVideo ? "none" : "flex" }} />
                )
            ))}
            <View style={{ gap: 16, position: "absolute", bottom: 12, left: 12}}>
                {mediaFiles?.map((media, index) => (
                    <ImagePreview media={media} onPress={switchVideo} index={index} key={media.id} active={index === activeVideo} />
                ))}
            </View>
        </Animated.View>
    );
};