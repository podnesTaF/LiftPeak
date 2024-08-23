import React, {useState} from 'react';
import {FlatList, View} from "react-native";
import {Colors} from "@shared/styles";
import {useQuery} from "@tanstack/react-query";
import {getMyFollowings, IProfile, searchUsers, UserFollowListItem} from "@entities/user";
import {useSearch} from "@features/search";
import SearchBar from "@shared/components/form/SearchBar";



const RunnersSearch = () => {
    const {
        searchValue,
        setSearchValue,
        results: userProfiles,
    } = useSearch<IProfile[]>(searchUsers, '', 300, 'userProfiles');
    const [clicked, setClicked] = useState(false);
    const {data: followings} = useQuery({
        queryKey: ["myFollowings"],
        queryFn: async () =>  getMyFollowings({idOnly: true})
    })

    return (
            <View style={{
                backgroundColor: Colors.dark900,
                flex: 1,
                paddingTop: 12
            }}>
                <View style={{paddingVertical: 12, paddingHorizontal: 12}}>
                    <SearchBar clicked={clicked} searchPhrase={searchValue} setSearchPhrase={setSearchValue} setClicked={setClicked} />
                </View>
                <FlatList style={{
                    flex: 1
                }} data={userProfiles} renderItem={({item}) => (
                    <UserFollowListItem profile={item} isFollowing={!!followings?.find(f => f.id === item.user?.id)} />
                )} keyExtractor={(item) => item.id.toString()} />
            </View>
    );
}

export default RunnersSearch;