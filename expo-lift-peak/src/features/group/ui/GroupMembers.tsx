import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {getGroupMembers} from "@features/group/api/groupApi";
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {useRouter} from "expo-router";
import MemberItem from "@features/group/ui/MemberItem";

interface GroupMembersProps {
    groupId?: number | string;
}

const GroupMembers = ({groupId}: GroupMembersProps) => {
    const router = useRouter();
    const {data} = useQuery({
        queryKey: ['groupMembers', groupId],
        queryFn: () => getGroupMembers({id: groupId, count: 10}),
        enabled: !!groupId
    })

    return (
        <View>
            <View style={[defaultStyles.row, {paddingHorizontal: 12, paddingVertical: 16}]}>
                <Text style={defaultStyles.smallTitle}>
                    {data?.count} Members
                </Text>
                <TouchableOpacity onPress={() => router.push(`/(authenticated)/(tabs)/home/groups/${groupId}/members`)}>
                    <Text style={{color: Colors.success, fontWeight: "500", fontSize: 16}}>
                        View All
                    </Text>
                </TouchableOpacity>
            </View>
            {data?.data.map((member) => (
                <MemberItem item={member} key={member.id} />
             ))}
        </View>
    );
};

export default GroupMembers;