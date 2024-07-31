import React from 'react';
import {FlatList, ScrollView, Text, View} from "react-native";
import PagerView from "react-native-pager-view";
import FollowingCircle from "@features/follow/ui/FollowingCircle";

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
    // Width of the circle item
    const itemWidth = 50;
    // Width of the separator
    const separatorWidth = 16;
    // Total width of each item including the separator
    const snapInterval = itemWidth + separatorWidth;
    return (
        <ScrollView>
            <FlatList
                data={followers}
                horizontal
                pagingEnabled
                snapToInterval={snapInterval}
                decelerationRate={"fast"}
                ItemSeparatorComponent={() => <View style={{width: 16}} />}
                renderItem={({item}) => (
                    <FollowingCircle imageUrl={item.imageUrl} isOnline={item.isOnline} activeSelected={selected !== null} isActive={item.id === selected}  onPress={() => setSelected(prev => prev === item.id ? null : item.id)} />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
            />
        </ScrollView>

    );
};

export default FollowingCircles;