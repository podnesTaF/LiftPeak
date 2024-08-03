import React, {useState} from 'react';
import {FlatList, ScrollView, Text, View} from "react-native";
import InputField from "@shared/components/form/InputField";
import {Colors} from "@shared/styles";
import {useQuery} from "@tanstack/react-query";
import api from "@shared/api/AxiosInstance";
import {getMyFollowings, IProfile, searchUsers, UserFollowListItem} from "@entities/user";
import {useSearch} from "@features/search";



const RunnersSearch = () => {
    const {
        searchValue,
        setSearchValue,
        results: userProfiles,
        queryInfo,
    } = useSearch<IProfile[]>(searchUsers, '', 300, 'userProfiles');

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
                <View style={{paddingVertical: 24, paddingHorizontal: 12}}>
                    <InputField value={searchValue} onChange={(value: string) => setSearchValue(value)} placeholder={"Search"} />
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