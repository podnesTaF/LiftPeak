import React from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {IGroupPost} from "@entities/post";
import {useRouter} from "expo-router";
import Avatar from "@shared/components/Avatar";
import {formatDistanceToNow} from "date-fns";
import {Ionicons} from "@expo/vector-icons";
import {getContentByType} from "@features/group/utils/post-filters";
import {getTextStyle} from "@features/group/utils/post-helpers";
import {PostActions} from "@features/feed/ui/WorkoutPost";
import {CommentType} from "@entities/reaction";

interface GroupPostProps {
    groupPost: IGroupPost;
}

const GroupPost = ({groupPost}: GroupPostProps) => {

    return (
        <View style={{padding: 12, gap: 12}}>
            <GroupPostHeader groupPost={groupPost} />
            <GroupPostBody groupPost={groupPost} />
            <PostActions type={CommentType.GROUP_POST} item={groupPost} />
        </View>
    );
};

const GroupPostHeader = ({groupPost}: {groupPost: IGroupPost}) => {
    const router = useRouter();
    return (
        <TouchableOpacity style={defaultStyles.row} onPress={() => router.push(`/(authenticated)/(tabs)/groups/${groupPost.groupId}`)}>
            <View style={{flexDirection: "row", alignItems: "center", gap:4}}>
                <Avatar size={40} url={groupPost.group?.pictureUrl} name={groupPost.group?.name[0]} />
                <View style={{gap: 4}}>
                    <Text style={{color: "white", fontWeight: "500"}}>
                        {groupPost.group?.name}
                    </Text>
                    <Text style={defaultStyles.secondaryText}>
                        {formatDistanceToNow(new Date(groupPost.createdAt), {addSuffix: true}).replace("minute", "min")}
                    </Text>
                </View>
            </View>
            <TouchableOpacity>
                <Ionicons name={"ellipsis-vertical"} size={24} color={Colors.dark300} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const GroupPostBody = ({groupPost}: {groupPost: IGroupPost}) => {
    const {exercise, image, text, workout} = getContentByType(groupPost.contents);
    const screenWidth = Dimensions.get('window').width;
    const isLargeScreen = screenWidth > 500;
    const imageWidth = isLargeScreen ? 400 : screenWidth - 32;
    const imageHeight = imageWidth * 0.8;
    const router = useRouter();


    const title = text.find(c => c.textType === 'title');

    return (
        <View style={{gap: 8}}>
            {text.map((item) => (
                <Text
                    key={item.id}
                    style={[{
                        color: 'white',
                        textAlignVertical: 'top',
                    }, getTextStyle(item.textType!)]}
                >
                    {item.content}
                </Text>
            ))}
            <Text style={{
                fontWeight: "600",
                color: Colors.success,
                fontSize: 14
            }}>
                Read Full Post
            </Text>
            <FlatList
                data={image}
                horizontal
                pagingEnabled
                snapToInterval={imageWidth + 16}
                decelerationRate={"fast"}
                ItemSeparatorComponent={() => <View style={{width: 16}}/>}
                renderItem={({item, index}) => (
                    <>
                        {index === 0 && <View style={{width: 12}}></View>}
                        <Image
                            source={{uri: item.imageUrl}}
                            style={[{width: imageWidth, height: imageHeight, borderRadius: 10,
                                overflow: 'hidden',
                                marginTop: 10,}]}
                            resizeMode="cover"
                        />
                        {index + 1 === image.length && <View style={{width: 12}}></View>}
                    </>
                )}
                keyExtractor={(item) => item.id!.toString()}
                showsHorizontalScrollIndicator={false}
            />
            <View style={{gap: 6}}>
                {exercise.length > 0 && <View style={styles.widgetContainer}>
                    <Text>
                        {exercise.length} Exercises Attached
                    </Text>
                </View>}
                <View style={styles.widgetContainer}>
                    <Text>
                        {workout.length} Exercises Attached
                    </Text>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    widgetContainer: {
        padding: 12,
        paddingHorizontal: 16,
        backgroundColor: Colors.lime,
        borderRadius: 12
    },
})

export default GroupPost;