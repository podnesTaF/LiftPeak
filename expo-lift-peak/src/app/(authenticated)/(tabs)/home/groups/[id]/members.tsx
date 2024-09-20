import React, {useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {getGroupMembers} from "@features/group/api/groupApi";
import {Stack, useLocalSearchParams} from "expo-router";
import {FlatList, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import MemberItem from "@features/group/ui/MemberItem";
import SearchBar from "@shared/components/form/SearchBar";

const Members = () => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const [query, setQuery] = useState("");
    const [clicked, setClicked] = useState(false);
    const {data} = useQuery({
        queryKey: ['groupMembers_' + id + "_" + query],
        queryFn: () => getGroupMembers({id, query: query}),
        enabled: !!id
    })

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
                    <MemberItem item={item} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </>
    );
};

export default Members;