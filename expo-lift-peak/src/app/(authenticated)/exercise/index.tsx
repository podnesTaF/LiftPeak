import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import Animated, {
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {defaultStyles} from "@shared/styles";
import {ExerciseVideo} from "@entities/exercise";
import Button from "@shared/components/Button";

const videos = [
    "https://storage.googleapis.com/lift-peak/exercises/20/media/3125907-sd_960_540_25fps.mp4",
    "https://storage.googleapis.com/lift-peak/exercises/20/media/3209300-sd_960_540_25fps.mp4"
]

const Stats = () => {
    const {scrollY} = useAnimatedScroll();
    const [activeVideo, setActiveVideo] = React.useState<number>(0);
    const opacity = useSharedValue(1);

    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const switchVideo = (index: number) => {
        opacity.value = withTiming(0.5, { duration: 150 }, () => {
            runOnJS(setActiveVideo)(index);
            opacity.value = withTiming(1, { duration: 150 });
        });
    };

    return (
        <Animated.ScrollView scrollEventThrottle={16} onScroll={scrollHandler} style={[defaultStyles.container]}>
            <Animated.View  style={animatedStyle}>
                {videos.map((video, index) => (
                    index === activeVideo && <ExerciseVideo key={index + video} url={video} />
                ))}
            </Animated.View>
            <View style={{flexDirection: "row", gap: 16, padding: 16}}>
                <Button title={"Front"} onPress={() => setActiveVideo(0)} color={"transparent"}/>
                <Button title={"Side"} onPress={() => switchVideo(1)} color={"transparent"}/>
            </View>
        </Animated.ScrollView>
    );
};

export default Stats;