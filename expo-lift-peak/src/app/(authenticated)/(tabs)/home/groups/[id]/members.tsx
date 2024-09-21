import React, {useRef, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {getGroupMembers, getMyMembership} from "@features/group/api/groupMember";
import {Stack, useLocalSearchParams} from "expo-router";
import {FlatList, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import MemberItem from "@features/group/ui/MemberItem";
import SearchBar from "@shared/components/form/SearchBar";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {IMember} from "@entities/group";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";
import MemberActions from "@features/group/ui/MemberActions";

const Members = () => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const [query, setQuery] = useState("");
    const [clicked, setClicked] = useState(false);
    const bottomSheetRef = useRef<BottomSheetModal>()
    const [selectedMember, setSelectedMember] = useState<IMember | null>(null)

    const {data: myMembership} = useQuery({
        queryKey: ['membership', id],
        queryFn: () => getMyMembership(id!),
        enabled: !!id
    })

    const {data} = useQuery({
        queryKey: ['groupMembers', id, query],
        queryFn: () => getGroupMembers({id, query: query}),
        enabled: !!id
    })

    const onSelectMember = (member: IMember) => {
        setSelectedMember(member)
        bottomSheetRef.current?.present();
    }

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerBackTitleVisible: false,
                headerTitle: "People",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: Colors.dark700
                }
            }} />
            <FlatList
                style={defaultStyles.container}
                contentContainerStyle={{paddingBottom: 100}}
                ListHeaderComponent={
                    <View style={{padding: 12}}>
                        <SearchBar clicked={clicked} searchPhrase={query} setSearchPhrase={setQuery} setClicked={setClicked} />
                    </View>
                }
                data={data?.data}
                renderItem={({item}) => (
                    <MemberItem item={item} onSelect={onSelectMember} membership={myMembership} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <CustomBottomSheet hideFooter ref={bottomSheetRef as any} snapPoints={["30%"]} handleClose={() => bottomSheetRef.current?.close()}>
                {selectedMember && myMembership?.role === "admin" && <MemberActions close={() => bottomSheetRef.current?.dismiss()} selectedMember={selectedMember} membership={myMembership} groupId={+id!} />}
            </CustomBottomSheet>
        </>
    );
};

export default Members;