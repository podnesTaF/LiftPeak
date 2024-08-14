import React from 'react';
import {FlatList, ScrollView, Text, View} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {ExerciseCard, findExerciseList} from "@entities/exercise";
import {Colors, defaultStyles} from "@shared/styles";
import {useRouter} from "expo-router";
import {useSearch} from "@features/search";
import {IProfile, searchUsers} from "@entities/user";
import SearchBar from "@shared/components/form/SearchBar";
import InputField from "@shared/components/form/InputField";

const WorkoutConstructorPage = () => {

    const router = useRouter();
    const {
        searchValue,
        setSearchValue,
        results: userProfiles,
        queryInfo,
    } = useSearch<IProfile[]>(searchUsers, '', 300, 'userProfiles');
    const {data} = useQuery({
        queryKey: ['exerciseList', searchValue],
        queryFn: async () => findExerciseList({search: searchValue}),
    })


    return (
        <View style={defaultStyles.container}>
            <View style={{
                width: "100%",
                padding: 12
            }}>
                <InputField value={searchValue} onChange={(value: string) => setSearchValue(value)} placeholder={"Search"} />
            </View>
            <FlatList data={data}
                      renderItem={({item}) =>
                          <ExerciseCard onPress={() => router.push({pathname: "/(authenticated)/exercise", params: {id: item.id}})} exercise={item}
                          />
                      }
                      ItemSeparatorComponent={() => <View style={{height: 2, backgroundColor: Colors.dark300}}/>}
                      keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default WorkoutConstructorPage;