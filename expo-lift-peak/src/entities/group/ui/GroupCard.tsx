import React from 'react';
import {IGroup} from "@entities/group/model";
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import Button from "@shared/components/Button";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "expo-router";
import {joinGroup, leaveGroup} from "@entities/group/api";

interface GroupCardProps {
    group: IGroup;
}

export const GroupCard = ({group}: GroupCardProps) => {
    const [followersCount, setFollowersCount] = React.useState(group.membersCount || 0);
    const [isMember, setIsMember] = React.useState(group.isMember || false);
    const router = useRouter();
    const {mutate} = useMutation({
        mutationFn: () => joinGroup(group.id),
        onSuccess: () => {
            setFollowersCount(followersCount + 1);
            setIsMember(true);
        }
    })

    const {mutate: unfollow} = useMutation({
        mutationFn: () => leaveGroup(group.id),
        onSuccess: () => {
            setFollowersCount(followersCount - 1);
            setIsMember(false);
        }
    })

    return (
        <TouchableOpacity onPress={() => router.push(`/(authenticated)/(tabs)/home/groups/${group.id}`)} style={{borderRadius: 8, backgroundColor: Colors.dark700, padding: 12, gap: 12}}>
            <View style={[defaultStyles.row, {gap: 10}]}>
                <Avatar size={55} url={group.pictureUrl}>
                    <Ionicons name={"barbell"} color={Colors.dark300} size={32} />
                </Avatar>
                <Text style={defaultStyles.secondaryText}>
                    {group.groupTag}
                </Text>
            </View>
            <View style={{gap: 8}}>
                <Text style={defaultStyles.smallTitle}>
                    {group.name}
                </Text>
                <Text style={defaultStyles.secondaryText}>
                    {group.membersCount} warriors
                </Text>
            </View>
            {isMember ? (
                <Button onPress={unfollow}  color={"dark500"} title={"following"} />
            ) : (
                <Button onPress={mutate} color={"white"} title={"follow"} />
            )}
        </TouchableOpacity>
    );
};