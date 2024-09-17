import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {getGroupFeed} from "@features/group/api/groupPostsApi";
import {View} from "react-native";
import GroupPost from "@features/group/ui/GroupPost";

interface GroupPostsFeedProps {
    groupId?: number | string;
}

const GroupPostsFeed = ({groupId}:GroupPostsFeedProps) => {

    const {data} = useQuery({
        queryKey: ["groupPosts", groupId],
        queryFn: () => getGroupFeed(groupId as number),
        enabled: !!groupId
    })

    return (
        <View style={{gap: 12}}>
            {data?.map((post) => (
                <View key={post.id} style={{paddingVertical: 20}}>
                  <GroupPost groupPost={post} />
                </View>
            ))}
        </View>
    );
};

export default GroupPostsFeed;