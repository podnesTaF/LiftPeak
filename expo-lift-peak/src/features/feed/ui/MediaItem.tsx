import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {ResizeMode, Video} from 'expo-av';
import PostVideo from "@features/feed/ui/PostVideo";
import {IWorkoutMedia} from "@entities/workout/model/IWorkoutMedia";

const MediaItem = ({ media, isVisible }: {media: IWorkoutMedia, isVisible?: boolean}) => {

    if (media.mediaType === 'image') {
        return (
            <Image
                source={{ uri: media.mediaUrl }}
                style={styles.media}
                resizeMode={ResizeMode.COVER}
            />
        )
    } else if (media.mediaType === 'video') {
        return (
           <PostVideo videoUri={media.mediaUrl} isVisible={isVisible} />
    );
    } else {
        return null;
    }
};

const styles = StyleSheet.create({
    media: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
});

export default MediaItem;
