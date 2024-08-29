import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Pressable,
    ViewToken
} from "react-native";
import Avatar from "@shared/components/Avatar";
import {IWorkout} from "@entities/workout";
import {Colors, defaultStyles} from "@shared/styles";
import {formatTime, formatDistance, formatVolume} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";
import {useCommentStore} from "@features/feed/store";
import {useMutation} from "@tanstack/react-query";
import {reactWorkout} from "@features/feed/api";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useRouter} from "expo-router";
import {CommentType} from "@entities/reaction";
import {IGroupPost} from "@entities/post";
import MediaItem from "@features/feed/ui/MediaItem";
import {IWorkoutMedia} from "@entities/media";

interface WorkoutPostProps {
    workout: IWorkout
    isViewable?: boolean
}

export const WorkoutPost = ({workout, isViewable} : WorkoutPostProps) => {
    const router = useRouter();

    return (
        <>
            <View style={{paddingVertical: 16, gap: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.dark500}}>
                <WorkoutPostBody isViewable={isViewable} onPress={() => router.push({pathname: "/(authenticated)/workout-details/", params: {id: workout.id}})} workout={workout} photosShown={true} />
                <PostActions item={workout} type={CommentType.WORKOUT_POST}  />
            </View>
        </>
    );
};

export const WorkoutPostBody = ({workout, photosShown, onPress, isViewable}: {workout: IWorkout, photosShown?: boolean, onPress?: Function, isViewable?: boolean}) => {
    const screenWidth = Dimensions.get('window').width;
    const isLargeScreen = screenWidth > 500;
    const imageWidth = isLargeScreen ? 400 : screenWidth - 32;
    const imageHeight = imageWidth * 0.8;
    const router = useRouter();
    const [visibleItems, setVisibleItems] = useState<number[]>([]);



    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        const visibleIds = viewableItems.map(item => item.item.id);
        setVisibleItems(visibleIds);
    }).current;

    return (
        <>
        <TouchableOpacity onPress={() => router.push({pathname: "/(authenticated)/profile", params: {id: workout.user?.id}})} style={styles.userInfoContainer}>
            <Avatar size={40} name={workout.user?.profile?.firstName[0] + '' + workout.user?.profile?.lastName[0]} url={workout.user?.profile?.avatarUrl} />
            <Text style={defaultStyles.secondaryText}>
                {workout.user?.profile?.firstName} {workout.user?.profile?.lastName}
            </Text>
        </TouchableOpacity>
          <View style={{gap: 10}}>
                <TouchableOpacity activeOpacity={onPress ? 90 : 100} style={{gap: 10, paddingHorizontal: 12}} onPress={() => onPress && onPress()}>
                    <Text style={defaultStyles.smallTitle}>
                        {workout.title}
                    </Text>
                    <Text style={[defaultStyles.secondaryText, {color: Colors.dark100}]}>
                        {workout.description}
                    </Text>
                    <Text style={defaultStyles.secondaryText}>
                        {formatTime(workout.workoutLog?.durationInS)} · {formatVolume(workout.workoutLog?.totalVolume)} {formatDistance(workout.workoutLog?.totalDistanceInM)}
                    </Text>
                </TouchableOpacity>
                {photosShown && <FlatList
                    data={workout.mediaContents}
                    horizontal
                    pagingEnabled
                    snapToInterval={imageWidth + 16} // Snap to the width of the image + separator
                    decelerationRate="fast"
                    ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                    renderItem={({ item, index }) => (
                        <>
                            {index === 0 && <View style={{ width: 12 }}></View>}
                            <View style={{ width: imageWidth, height: imageHeight }}>
                                <MediaItem media={item} isVisible={!!visibleItems.find((id) => id === item.id) && isViewable} />
                            </View>
                            {index + 1 === workout.mediaContents?.length && <View style={{ width: 12 }}></View>}
                        </>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 60,
                    }}
                />}
          </View>
        </>
    )
}

interface WorkoutPostFooterProps {
    item: IWorkout | IGroupPost;
    type: CommentType;
}

export const PostActions = ({item, type}: WorkoutPostFooterProps) => {
    const {showPostComments, showWorkoutComments} = useCommentStore()
    const [likeCount, setLikeCount] = React.useState(item.likesCount);
    const [liked, setLiked] = React.useState(item.liked);
    const [commentCount, setCommentCount] = React.useState(item.commentsCount);
    const scale = useSharedValue(1);

    const {mutate} = useMutation({
        mutationFn: () => reactWorkout(+item.id),
        onSuccess: (data) => {
            scale.value = withTiming(data.like ? 1.5 : 1, { duration: 200 }, () => {
                scale.value = withTiming(1, { duration: 200 });
            });
            setLikeCount(data.likesCount);
            setLiked(data.like);
        }
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const showCommentSheet = () => {
       if(type === CommentType.WORKOUT_POST) {
           showWorkoutComments(item as IWorkout);
       } else {
              showPostComments(item as IGroupPost);
       }
    }

    return (
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12}}>
            <Animated.View style={[{flexDirection: "row", gap: 8, alignItems: "center"}, animatedStyle]}>
                <TouchableOpacity onPress={() => mutate()}>
                    <Ionicons name="heart-outline" size={24} color={liked ? Colors.danger : Colors.dark300} />
                </TouchableOpacity>
                <Pressable>
                    <Text style={defaultStyles.secondaryText}>{likeCount}</Text>
                </Pressable>
            </Animated.View>
            <View style={{flexDirection: "row", gap: 8, alignItems: "center"}}>
                <TouchableOpacity onPress={showCommentSheet}>
                    <Ionicons name="chatbubble-outline" size={24} color={Colors.dark300} />
                </TouchableOpacity>
                <Pressable>
                    <Text style={defaultStyles.secondaryText}>{item.commentsCount}</Text>
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
    )
}

const styles = StyleSheet.create({
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 12,
    },
    mediaImage: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
    }
})

export default WorkoutPost;