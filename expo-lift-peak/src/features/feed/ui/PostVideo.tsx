import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Pressable} from "react-native";
import {ResizeMode, Video} from "expo-av";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import ReliableVideo from "@shared/components/ReliableVideo";

interface PostVideoProps {
    videoUri: string;
    isVisible?: boolean;
}

const PostVideo: React.FC<PostVideoProps> = ({ videoUri , isVisible}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<Video>(null);

    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current?.pauseAsync();
        } else {
            videoRef.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const handleMuteUnmute = () => {
        videoRef.current?.setIsMutedAsync(!isMuted);
        setIsMuted(!isMuted);
    };

    useEffect(() => {
        console.log(isVisible)
        if(!isVisible) {
            console.log("pausing")
            videoRef.current?.pauseAsync()
            setIsPlaying(false)
        } else {
            console.log("playing")
            videoRef.current?.playAsync()
            setIsPlaying(true)
        }
    }, [isVisible]);


    return (
        <Pressable onPress={handlePlayPause} style={styles.videoContainer}>
            <ReliableVideo
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={false}
                isMuted={isMuted}
                useNativeControls={false}
            />
            {!isPlaying && (
                <TouchableOpacity style={{position: "absolute", left: "48%", top: "48%"}}>
                    <Ionicons name={"play"} size={32} color={Colors.white} />
                </TouchableOpacity>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    videoContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: Colors.dark700,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
});

export default PostVideo;