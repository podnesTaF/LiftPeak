import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatusSuccess } from 'expo-av/src/AV.types';
import { Colors } from '@shared/styles';
import ReliableVideo from "@shared/components/ReliableVideo";

interface ExerciseVideoProps {
    url: string;
    hide?: boolean;
}

export function ExerciseVideo({ url, hide }: ExerciseVideoProps) {
    const video = useRef<Video>(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<AVPlaybackStatusSuccess | null>(null);
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
        <View style={[styles.container, {display: hide ? "none" : "flex"}]}>
            {!loading && error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        There was an error loading the video. Please try again later.
                    </Text>
                </View>
            )}
            {loading && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Loading...</Text>
                </View>
            )}
            <ReliableVideo
                ref={video}
                style={styles.video}
                source={{
                    uri: url,
                }}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={true}
                isMuted={true}
                useNativeControls={false}
                onReadyForDisplay={() => setLoading(false)}
                onError={(error) => setError(error)}
                onLoadStart={() => setLoading(true)}
                onPlaybackStatusUpdate={(status) => setStatus(status as AVPlaybackStatusSuccess)}
            />
            {!loading && !error && <View style={styles.controls}>
                <TouchableOpacity style={{opacity: isPlaying ? 0.7 : 1}} onPress={togglePlayback}>
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={32}
                        color={Colors.lime}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={changePlaybackSpeed}
                                  style={[styles.roundedButton, {opacity: isPlaying ? 0.7 : 1}]}>
                    <Text style={{color: Colors.lime, fontSize: 12, fontWeight: "600"}}>
                        x{playbackSpeed === 1.0 ? '1' : '.7'}
                    </Text>
                </TouchableOpacity>
            </View>}
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
    errorContainer: {position: "absolute", padding: 16, flex: 1, width: "100%", justifyContent: "center", alignItems: "center"},
    errorText: {color: Colors.danger, fontSize: 16, fontWeight: "500"},
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
    roundedButton: {
        padding: 4,
        height: 32,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: Colors.lime,
    }
});
