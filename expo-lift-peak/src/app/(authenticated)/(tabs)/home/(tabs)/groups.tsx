import React from 'react';
import {FlatList, ScrollView, Text, View} from "react-native";
import FollowingCircles from "@features/follow/ui/FollowingCircles";
import {defaultStyles} from "@shared/styles";
import {GroupCard, searchGroups} from "@entities/group";
import {useQuery} from "@tanstack/react-query";
import {useHeaderHeight} from "@react-navigation/elements";

const Groups = () => {
    const {data} = useQuery({
        queryKey: ["groups"],
        queryFn: () => searchGroups("")
    })
    const headerHeight = useHeaderHeight()

    return (
        <View style={[defaultStyles.container]}>
            <FlatList
                contentContainerStyle={{paddingTop: headerHeight + 50}}
                ListHeaderComponent={
                    <FollowingCircles type={"groups"} />
                }
                key={"f"}
                      data={data} numColumns={2} columnWrapperStyle={{
                gap: 12,
                paddingHorizontal: 12,
                paddingVertical: 6
            }} renderItem={({item}) => (
                <View style={{flex: 1}}>
                    <GroupCard group={item} />
                </View>
            )}
                      keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default Groups;