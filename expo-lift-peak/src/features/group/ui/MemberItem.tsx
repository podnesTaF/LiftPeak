import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import {IMember} from "@entities/group";
import {useRouter} from "expo-router";

const MemberItem = ({item, onSelect, membership}: {item: IMember, onSelect: (member: IMember) => void, membership?: IMember | null}) => {
    const router = useRouter()
    return (
        <View style={[defaultStyles.row, {paddingVertical: 8, paddingHorizontal: 12}]}>
            <TouchableOpacity
                style={{gap: 6, flexDirection: 'row', alignItems: 'center'}}
                onPress={() => router.push({pathname:`/(authenticated)/(tabs)/home/profile`, params: {id: item.userId}})}>
                <Avatar
                        name={item.user?.profile?.firstName[0]}
                        url={item.user?.profile?.avatarUrl}
                        size={48}
                    />
                <View style={{gap: 4}}>
                    <Text style={{color: "white", fontWeight: "500"}}>
                        {item.user?.profile?.firstName} {item.user?.profile?.lastName}
                    </Text>
                    <Text style={defaultStyles.secondaryText}>
                        {item.role}
                    </Text>
                </View>
            </TouchableOpacity>
            {membership?.role === 'admin' && membership.id !== item.id && <TouchableOpacity onPress={() => onSelect(item)}>
                <Ionicons name={"ellipsis-horizontal"} size={24} color={Colors.dark300}/>
            </TouchableOpacity>}
        </View>
    );
};

export default MemberItem;