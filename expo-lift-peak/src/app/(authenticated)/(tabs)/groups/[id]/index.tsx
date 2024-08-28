import React from 'react';
import {useLocalSearchParams} from "expo-router";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import {useQuery} from "@tanstack/react-query";
import {getGroup} from "@entities/group";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {defaultStyles} from "@shared/styles";
import {GroupHeader} from "@features/group/ui/GroupHeader";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";
import {MaterialIcons} from "@expo/vector-icons";
import GroupPostsFeed from "@features/group/ui/GroupPostsFeed";


const tabs = [
    {
        name: "feed",
        icon: <MaterialIcons name={"list-alt"} size={24} color={"white"} />
    },
    {
        name: "members",
        icon: <MaterialIcons name={"groups"} size={24} color={"white"} />
    },
]

const GroupPage = () => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const [activeTab, setActiveTab] = React.useState('feed')
    const {scrollY} = useAnimatedScroll();

    const {data} = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroup(id),
        enabled: !!id
    })

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <Animated.ScrollView onScroll={onScroll} stickyHeaderIndices={[1]} contentContainerStyle={{paddingBottom: 120}}
                             style={defaultStyles.container} scrollEventThrottle={16}>
            <GroupHeader group={data} />
            <CustomTabBar labelHidden={true} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}/>
            {activeTab === "feed" && (
                <GroupPostsFeed groupId={id} />
            )}
        </Animated.ScrollView>
    );
};

export default GroupPage;