import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {getGroupMembers, getMyMembership} from "@features/group/api/groupMember";
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {useRouter} from "expo-router";
import MemberItem from "@features/group/ui/MemberItem";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {IMember} from "@entities/group";
import MemberActions from "@features/group/ui/MemberActions";

interface GroupMembersProps {
    groupId?: number | string;
}

const GroupMembers = ({groupId}: GroupMembersProps) => {
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheetModal>()
    const [selectedMember, setSelectedMember] = useState<IMember | null>(null)

    const {data: myMembership} = useQuery({
        queryKey: ['membership', groupId],
        queryFn: () => getMyMembership(groupId!),
        enabled: !!groupId
    })
    const {data} = useQuery({
        queryKey: ['groupMembers', groupId],
        queryFn: () => getGroupMembers({id: groupId, count: 10}),
        enabled: !!groupId
    })

    const onSelectMember = (member: IMember) => {
        setSelectedMember(member)
        bottomSheetRef.current?.present();
    }

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
                <MemberItem item={member} key={member.id} onSelect={onSelectMember} membership={myMembership} />
             ))}
            <CustomBottomSheet hideFooter ref={bottomSheetRef as any} snapPoints={["30%"]} handleClose={() => bottomSheetRef.current?.close()}>
                {selectedMember && myMembership?.role === "admin" && <MemberActions close={() => bottomSheetRef.current?.dismiss()} selectedMember={selectedMember} membership={myMembership} groupId={+groupId!} />}
            </CustomBottomSheet>
        </View>
    );
};

export default GroupMembers;