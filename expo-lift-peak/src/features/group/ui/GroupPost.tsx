import React, {useState} from 'react';
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
import MediaGrid from "@shared/components/MediaGrid";
import PostContentItem from "@features/group/ui/PostContent/PostContentItem";

interface GroupPostProps {
    groupPost: IGroupPost;
}

const GroupPost = ({groupPost}: GroupPostProps) => {

    return (
        <View style={{gap: 12}}>
            <View style={{paddingHorizontal: 12}}>
                <GroupPostHeader groupPost={groupPost} />
            </View>
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
    const [isExpanded, setIsExpanded] = useState(false);
    const previewContent = isExpanded ? groupPost.contents : groupPost.contents.filter(c => c.type !== "image").slice(0,3 );
    const { exercise, image, workout } = getContentByType(groupPost.contents);
    return (
        <View style={{gap: 0}}>
            {previewContent.map((item) => (
               <PostContentItem  key={item.id} content={item}/>
            ))}
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                <Text
                    style={{
                        fontWeight: '600',
                        color: Colors.success,
                        fontSize: 14,
                        paddingHorizontal: 12,
                        marginVertical: 6,
                    }}
                >
                    {isExpanded ? 'Collapse Post' : 'Read Full Post'}
                </Text>
            </TouchableOpacity>
            {!isExpanded &&
               <>
                   <View style={{marginVertical: 12}}>
                       <MediaGrid images={image} />
                   </View>
                   <View style={{gap: 6, paddingHorizontal: 12}}>
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
               </>
            }
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