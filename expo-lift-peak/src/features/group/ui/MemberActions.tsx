import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {IMember, MemberRole} from "@entities/group";
import {useMutation} from "@tanstack/react-query";
import {privilegeRole, removeFromGroup} from "@features/group/api/groupMember";
import {queryClient} from "@shared/api";
import {useToastStore} from "@shared/store";

interface MemberActionsProps {
    selectedMember: IMember;
    membership?: IMember | null
    groupId: number;
    close: () => void
}
const MemberActions = ({selectedMember, membership, groupId, close}: MemberActionsProps) => {
    const {showToast} = useToastStore()

    const {mutate: removeMember} = useMutation({
        mutationFn: () => removeFromGroup(selectedMember.id, groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['groupMembers', groupId.toString()]});
            close()
        }
    })

    const {mutate: manageRole} = useMutation({
        mutationFn: (props: {id: number, role: MemberRole, groupId:  number}) => privilegeRole(props),
        onSuccess: () => {
            queryClient.invalidateQueries(
                {queryKey: ['groupMembers',  groupId.toString()]}
            )
            close()

        },
        onError: () => {
            showToast('Error Changing Role', "There an error occurs. Please try again", "error")
        }
    })

    return (
        <View style={{gap: 12, paddingHorizontal: 12}}>
            {selectedMember?.role === 'member' ? <TouchableOpacity
                onPress={() => manageRole({id: selectedMember.id, groupId, role: MemberRole.ADMIN})}
                style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                <Ionicons name={"star"} size={30} color={Colors.success}/>
                <Text style={{fontSize: 16, fontWeight: "500", color: "white"}}>
                    Privilege admin role
                </Text>
            </TouchableOpacity> : (
                <TouchableOpacity
                    onPress={() => manageRole({id: selectedMember.id, groupId, role: MemberRole.MEMBER})}
                    style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                    <Ionicons name={"star-half"} size={30} color={Colors.danger}/>
                    <Text style={{fontSize: 16, fontWeight: "500", color: "white"}}>
                        Remove as admin
                    </Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => removeMember()} style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                <Ionicons name={"close-circle-outline"} size={30} color={Colors.danger}/>
                <Text style={{fontSize: 16, fontWeight: "500", color: "white"}}>
                    Remove from group
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MemberActions;