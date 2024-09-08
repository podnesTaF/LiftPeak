import React from 'react';
import {Text, View} from "react-native";
import Avatar from "@shared/components/Avatar";
import {Colors, defaultStyles} from "@shared/styles";
import {formatDistanceToNow} from "date-fns";
import {IComment} from "@entities/reaction";

interface CommentProps {
    comment: IComment
}

const Comment = ({comment}: CommentProps) => {
    return (
        <View style={{flexDirection: "row", gap:8, alignItems: 'flex-start'}}>
            <Avatar name={comment.commenter?.profile?.firstName[0] + "" + comment.commenter?.profile?.lastName[0]} size={32} url={comment.commenter?.profile?.avatarUrl} />
            <View style={{padding: 8, borderRadius: 16, gap: 10, backgroundColor: Colors.dark500, flexShrink: 1}}>
                <View style={{flexDirection: "row", gap: 8, alignItems:"center"}}>
                    <Text style={[defaultStyles.smallTitle, {fontSize: 16}]}>
                        {comment.commenter?.profile?.firstName} {comment.commenter?.profile?.lastName}
                    </Text>
                    <Text style={[defaultStyles.secondaryText, {fontSize: 14}]}>
                        {formatDistanceToNow(new Date(comment.createdAt), {addSuffix: true}).replace("minute", "min")}
                    </Text>
                </View>
                <Text style={{color: "white", fontWeight: "500", flexWrap: "wrap"}} numberOfLines={3} ellipsizeMode="tail">
                    {comment.content}
                </Text>
            </View>
        </View>
    );
};

export default Comment;