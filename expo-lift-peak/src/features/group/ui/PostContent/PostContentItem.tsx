import React from 'react';
import {IPostContent} from "@entities/post";
import Poll from "@features/group/ui/PostContent/Poll";
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {getTextStyle} from "@features/group/utils/post-helpers";
import {IPoll} from "@entities/post/model/IPoll";
import {RoutineCard} from "@entities/routine";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

interface PostContentItemProps {
    content: IPostContent;
}

const screenWidth = Dimensions.get('window').width;


const PostContentItem = ({content}: PostContentItemProps) => {
    const router = useRouter()
    return (
        <>
            {content.type === 'poll' && content.poll && (
                <Poll poll={content.poll as IPoll} />
            )}
            {content.type === "text" && (
                <Text
                    key={content.id}
                    style={[
                        {
                            color: 'white',
                            textAlignVertical: 'top',
                            paddingHorizontal: 12,
                        },
                        getTextStyle(content.textType!),
                    ]}
                >
                    {content.content}
                </Text>
            )}
            {content.type === "image" && (
                <View style={{width: '100%', height: screenWidth * 0.7}}>
                    <Image
                        source={{uri: content.imageUrl}}
                        style={{width: "100%", height: "100%"}}
                        resizeMode="cover"
                    />
                </View>
            )}
            {content.type === "workout" && content.workoutPreview && (
                <RoutineCard workout={content.workoutPreview} addAvailable={false}/>
            )}
            {content.type === 'exercise' && (
                <View style={styles.attachmentContainer}>
                    <Text style={[defaultStyles.smallTitle, {fontSize: 16}]}>
                        {content.exercise?.name}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/(authenticated)/exercises/" + content.exerciseId)}>
                        <Ionicons name={"information-circle-outline"} size={30} color={"white"} />
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    attachmentContainer: {
        backgroundColor: Colors.success,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        justifyContent: "space-between"
    }
})

export default PostContentItem;