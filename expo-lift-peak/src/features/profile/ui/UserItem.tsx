import React from 'react';
import {IUser} from "@entities/user";
import {Colors, defaultStyles} from "@shared/styles";
import {Text, TouchableOpacity, View} from "react-native";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {useAuthStore} from "@features/auth";

interface UserItemProps {
    user: IUser;
    profileUserId: number;
    onSelect: (user: IUser) => void
}

const UserItem = ({user, onSelect, profileUserId}: UserItemProps) => {
    const {user: authUser} = useAuthStore()
    const router = useRouter()

    return (
        <View style={[defaultStyles.row, {paddingVertical: 8, paddingHorizontal: 12}]}>
            <TouchableOpacity
                style={{gap: 6, flexDirection: 'row', alignItems: 'center'}}
                onPress={() => router.push({pathname:`/(authenticated)/(tabs)/home/profile`, params: {id: user.id}})}>
                <Avatar
                    name={user.profile?.firstName[0]}
                    url={user.profile?.avatarUrl}
                    size={48}
                />
                <View style={{gap: 4}}>
                    <Text style={{color: "white", fontWeight: "500"}}>
                        {user.profile?.firstName} {user.profile?.lastName}
                    </Text>
                    <Text style={defaultStyles.secondaryText}>
                        @{user.username}
                    </Text>
                </View>
            </TouchableOpacity>
            {authUser?.id === profileUserId && <TouchableOpacity onPress={() => onSelect(user)}>
                <Ionicons name={"ellipsis-horizontal"} size={24} color={Colors.dark300}/>
            </TouchableOpacity>}
        </View>
    );
};

export default UserItem;