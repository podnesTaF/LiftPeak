import React, {useRef} from 'react';
import {View, StyleSheet, Text, Image, FlatList, Dimensions, TouchableOpacity, Pressable} from "react-native";
import Avatar from "@shared/components/Avatar";
import {IWorkout} from "@entities/workout";
import {Colors, defaultStyles} from "@shared/styles";
import {formatTime, formatDistance, formatVolume} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";
import {useCommentStore} from "@features/feed/store";

interface WorkoutPostProps {
    workout: IWorkout
}

export const WorkoutPost = ({workout} : WorkoutPostProps) => {
    const {show} = useCommentStore()


    const showCommentSheet = () => {
        show(workout)
    }

    return (
        <>
            <View style={{paddingVertical: 16, paddingHorizontal: 12, gap: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.dark500}}>
                <WorkoutPostBody workout={workout} photosShown={true} />
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <View style={{flexDirection: "row", gap: 8, alignItems: "center"}}>
                        <TouchableOpacity>
                            <Ionicons name="heart-outline" size={24} color={Colors.dark300} />
                        </TouchableOpacity>
                        <Pressable>
                            <Text style={defaultStyles.secondaryText}>1,1k</Text>
                        </Pressable>
                    </View>
                    <View style={{flexDirection: "row", gap: 8, alignItems: "center"}}>
                        <TouchableOpacity onPress={showCommentSheet}>
                            <Ionicons name="chatbubble-outline" size={24} color={Colors.dark300} />
                        </TouchableOpacity>
                        <Pressable>
                            <Text style={defaultStyles.secondaryText}>12</Text>
                        </Pressable>
                    </View>
                    <View style={{flexDirection: "row", gap: 8, alignItems: "center"}}>
                        <TouchableOpacity>
                            <Ionicons name="arrow-redo-outline" size={24} color={Colors.dark300} />
                        </TouchableOpacity>
                        <Pressable>
                            <Text style={defaultStyles.secondaryText}>10</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
};

export const WorkoutPostBody = ({workout, photosShown}: {workout: IWorkout, photosShown?: boolean}) => {
    const screenWidth = Dimensions.get('window').width;
    const isLargeScreen = screenWidth > 500;
    const imageWidth = isLargeScreen ? 400 : screenWidth - 32;
    const imageHeight = imageWidth * 0.8;

    return (
        <>
            <View style={styles.userInfoContainer}>
                <Avatar size={40} name={workout.user?.profile?.firstName[0] + '' + workout.user?.profile?.lastName[0]} url={workout.user?.profile?.avatarUrl} />
                <Text style={defaultStyles.secondaryText}>
                    {workout.user?.profile?.firstName} {workout.user?.profile?.lastName}
                </Text>
            </View>
            <View style={{gap: 10}}>
                <Text style={defaultStyles.smallTitle}>
                    {workout.title}
                </Text>
                <Text style={[defaultStyles.secondaryText, {color: Colors.dark100}]}>
                    {workout.description}
                </Text>
                <Text style={defaultStyles.secondaryText}>
                    {formatTime(workout.workoutLog?.durationInS)} · {formatVolume(workout.workoutLog?.totalVolume)} {formatDistance(workout.workoutLog?.totalDistanceInM)}
                </Text>
                {photosShown && <FlatList
                    data={workout.mediaContents}
                    horizontal
                    pagingEnabled
                    snapToInterval={imageWidth + 16} // Snap to the width of the image + separator
                    decelerationRate={"fast"}
                    ItemSeparatorComponent={() => <View style={{width: 16}}/>}
                    renderItem={({item}) => (
                        <Image
                            source={{uri: item.mediaUrl}}
                            style={[styles.mediaImage, {width: imageWidth, height: imageHeight}]}
                            resizeMode="cover"
                        />
                    )}
                    keyExtractor={(item) => item.id!.toString()}
                    showsHorizontalScrollIndicator={false}
                />}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    mediaImage: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
    }
})

export default WorkoutPost;