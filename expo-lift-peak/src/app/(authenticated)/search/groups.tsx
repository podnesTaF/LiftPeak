import React, {useState} from 'react';
import {FlatList, Text, View} from "react-native";
import {Colors} from "@shared/styles";
import InputField from "@shared/components/form/InputField";
import {useQuery} from "@tanstack/react-query";
import {GroupCard, searchGroups} from "@entities/group";
import SearchBar from "@shared/components/form/SearchBar";
import CreateGroupPlaceholder from "@features/group/ui/CreateGroupPlaceholder";

const GroupSearch = () => {
    const [value, setValue] = useState("");
    const [clicked, setClicked] = useState(false);

    const {data} = useQuery({
        queryKey: ['groupSearch', value],
        queryFn: () => searchGroups(value),
        enabled: value.length > 0
    })

    return (
        <View style={{
            backgroundColor: Colors.dark900,
            flex: 1,
            paddingTop: 12
        }}>
            <View style={{paddingVertical: 12, paddingHorizontal: 12}}>
                <SearchBar clicked={clicked} searchPhrase={value} setSearchPhrase={setValue} setClicked={setClicked} />
            </View>
            <FlatList
                ListHeaderComponent={ <CreateGroupPlaceholder />}
                key={"f"} data={data} numColumns={2} columnWrapperStyle={{
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

export default GroupSearch;