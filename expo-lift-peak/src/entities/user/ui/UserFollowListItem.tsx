import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from "react-native";
import {followUser, IProfile, IUser, unfollowUser} from "@entities/user";
import {useAuthStore} from "@features/auth";
import Avatar from "@shared/components/Avatar";
import {Colors} from "@shared/styles";
import Button from "@shared/components/Button";
import {Ionicons} from "@expo/vector-icons";
import {useMutation} from "@tanstack/react-query";


interface UserFollowListItemProps {
    profile: IProfile;
    isFollowing?: boolean;
}


export const UserFollowListItem = ({profile, isFollowing}: UserFollowListItemProps) => {
    const {user: authenticatedUser} = useAuthStore();

    const isMe = authenticatedUser?.id === profile?.user?.id

    const {mutate} = useMutation({
        mutationKey: ["myFollowings"],
        mutationFn: async () => {
            if (isFollowing) {
                await unfollowUser(profile.user!.id);
            } else {
                await followUser(profile.user!.id);
            }
        }
    })

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.userInfoContainer}>
                <Avatar name={"" + profile?.firstName[0] + profile?.lastName[0]} size={40} />
                <View style={{gap:8}}>
                    <Text style={{color: Colors.white, fontSize: 16, fontWeight: "500"}}>
                        {profile?.firstName} {profile?.lastName}
                    </Text>
                </View>
            </View>
            {isMe ? (
                <Button title={"Me"} color={"transparent"} />
            ) : (
                isFollowing ? (
                    <Button onPress={mutate} title={"Following"} color={"dark500"} />
                ) : (
                    <Button onPress={mutate} title={"Follow"} color={"white"}>
                        <Ionicons name={"add"} size={16} color={Colors.dark900} />
                    </Button>
                )
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    }
})