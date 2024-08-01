import React from 'react';
import {FlatList, ScrollView, Text, View} from "react-native";
import PagerView from "react-native-pager-view";
import FollowingCircle from "@features/follow/ui/FollowingCircle";
import {useQuery} from "@tanstack/react-query";
import {getMyFollowings} from "@entities/user";

const followers = [
    {
        id: 1,
        imageUrl: "https://randomuser.me/api/portraits/men/34.jpg",
        isOnline: true
    },
    {
        id: 2,
        imageUrl: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    {
        id: 3,
        imageUrl: "https://randomuser.me/api/portraits/men/40.jpg",
    },
    {
        id: 4,
        imageUrl: "https://randomuser.me/api/portraits/men/38.jpg",
        isOnline: true
    },
    {
        id: 5,
        isOnline: true
    }
]

const FollowingCircles = () => {
    const [selected, setSelected] = React.useState<number | null>(null);

    const itemWidth = 50;
    const separatorWidth = 16;
    const snapInterval = itemWidth + separatorWidth;

    const {data: users} = useQuery({
        queryKey: ["followings"],
        queryFn: () => getMyFollowings()
    })

    return (
        <ScrollView>
            <FlatList
                data={users}
                horizontal
                pagingEnabled
                snapToInterval={snapInterval}
                decelerationRate={"fast"}
                ItemSeparatorComponent={() => <View style={{width:separatorWidth}} />}
                renderItem={({item, index}) => (
                    <FollowingCircle imageUrl={item.profile?.avatarUrl} isOnline={index % 2 === 0} activeSelected={selected !== null} isActive={item.id === selected}  onPress={() => setSelected(prev => prev === item.id ? null : item.id)} />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
            />
        </ScrollView>
    );
};

export default FollowingCircles;