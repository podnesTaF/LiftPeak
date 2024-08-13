import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatusSuccess } from 'expo-av/src/AV.types';
import { Colors } from '@shared/styles';
import Button from '@shared/components/Button';

interface ExerciseVideoProps {
    url: string;
}

export function ExerciseVideo({ url }: ExerciseVideoProps) {
    const video = useRef<Video>(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlayback = () => {
        if (isPlaying) {
            video.current?.pauseAsync();
            setIsPlaying(false);
        } else {
            video.current?.playAsync();
            setIsPlaying(true);
        }
    };

    const changePlaybackSpeed = async () => {
        const newSpeed = playbackSpeed === 1.0 ? 0.75 : 1.0;
        await video.current?.setRateAsync(newSpeed, true);
        setPlaybackSpeed(newSpeed);
    };

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: url,
                }}
                usePoster={true}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={true}
                isMuted={true}
                useNativeControls={false}
            />
            <View style={styles.controls}>
                <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={32}
                    color={Colors.dark700}
                    onPress={togglePlayback}
                />
                <Button
                    title={`Speed: ${playbackSpeed === 1.0 ? 'Normal' : '0.75x'}`}
                    onPress={changePlaybackSpeed}
                    color={'dark300'}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    video: {
        width: '100%',
        height: 300,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
