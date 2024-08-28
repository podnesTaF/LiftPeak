import React from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from "react-native";
import PagerView from "react-native-pager-view";
import FollowingCircle from "@features/follow/ui/FollowingCircle";
import {useQuery} from "@tanstack/react-query";
import {getMyFollowings} from "@entities/user";
import {Colors} from "@shared/styles";
import {getFollowedGroups} from "@entities/group";


const FollowingCircles = ({type = "users"}: {type?: "groups" | "users"}) => {
    const [selected, setSelected] = React.useState<number | null | undefined>(null);

    const itemWidth = 50;
    const separatorWidth = 16;
    const snapInterval = itemWidth + separatorWidth;

    const {data: users} = useQuery({
        queryKey: ["followings"],
        queryFn: () => getMyFollowings(),
        enabled: type === 'users'
    })


    const {data: groups} = useQuery({
        queryKey: ["followedGroups"],
        queryFn: () => getFollowedGroups(),
        enabled: type === 'groups'
    })

    return (
        <View style={{paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.dark300}}>
            {type === 'users' ? <FlatList
                data={users}
                horizontal
                pagingEnabled
                snapToInterval={snapInterval}
                decelerationRate={"fast"}
                ItemSeparatorComponent={() => <View style={{width: separatorWidth}}/>}
                renderItem={({item, index}) => (
                    <>
                        {index === 0 && <View style={{width: separatorWidth}}/>}
                        <FollowingCircle username={item.username} imageUrl={item.profile?.avatarUrl}
                                         isOnline={index % 2 === 0} activeSelected={selected !== null}
                                         isActive={item.id === selected}
                                         onPress={() => setSelected(prev => prev === item.id ? null : item.id)}/>
                    </>
                )}
                keyExtractor={(item) => item.id!.toString()}
                showsHorizontalScrollIndicator={false}
            /> : (
                <FlatList
                    data={groups}
                    horizontal
                    pagingEnabled
                    snapToInterval={snapInterval}
                    decelerationRate={"fast"}
                    ItemSeparatorComponent={() => <View style={{width: separatorWidth}}/>}
                    renderItem={({item, index}) => (
                        <>
                            {index === 0 && <View style={{width: separatorWidth}}/>}
                            <FollowingCircle username={item.name} imageUrl={item.pictureUrl}
                                             isOnline={index % 2 === 0} activeSelected={selected !== null}
                                             isActive={item.id === selected}
                                             onPress={() => setSelected(prev => prev === item.id ? null : item.id)}/>
                        </>
                    )}
                    keyExtractor={(item) => item.id!.toString()}
                    showsHorizontalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default FollowingCircles;