import React, {useRef, useState} from 'react';
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {IMember} from "@entities/group";
import {useQuery} from "@tanstack/react-query";
import {getPeople} from "@features/profile";
import {Colors, defaultStyles} from "@shared/styles";
import {FlatList, TouchableOpacity, View} from "react-native";
import SearchBar from "@shared/components/form/SearchBar";
import UserItem from "@features/profile/ui/UserItem";
import {IUser} from "@entities/user";
import {Ionicons} from "@expo/vector-icons";

const People = () => {
    const {type, id} = useLocalSearchParams<{type: "followers" | "following", id: string}>()
    const [query, setQuery] = useState("");
    const [clicked, setClicked] = useState(false);
    const bottomSheetRef = useRef<BottomSheetModal>(null)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const router = useRouter()
    const {data} = useQuery({
        queryKey: ['people', id, type, query],
        queryFn: () => getPeople({type: type!, name: query, userId: +id!}),
        enabled: !!id && !!type
    })

    const onSelectUser = (user: IUser) => {
        setSelectedUser(user)
    }

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerBackTitleVisible: false,
                headerTitle: type,
                headerTintColor: "white",
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name={"chevron-back"} size={30} color={'white'} />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: Colors.dark700,
                },
            }} />
            <FlatList
                style={defaultStyles.container}
                contentContainerStyle={{paddingBottom: 100}}
                ListHeaderComponent={
                    <View style={{padding: 12}}>
                        <SearchBar clicked={clicked} searchPhrase={query} setSearchPhrase={setQuery} setClicked={setClicked} />
                    </View>
                }
                data={data}
                renderItem={({item}) => (
                    <UserItem user={item} onSelect={onSelectUser} profileUserId={+id!} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </>
    );
};

export default People;