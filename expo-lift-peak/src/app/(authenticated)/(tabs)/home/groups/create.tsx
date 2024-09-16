import React, {useEffect, useState} from 'react';
import {Stack} from "expo-router";
import Button from "@shared/components/Button";
import {ScrollView, Text, StyleSheet, View, FlatList, Touchable, TouchableOpacity} from "react-native";
import {MediaPicker} from "@features/media-upload";
import FormField from "@shared/components/form/FormField";
import {FormProvider, useForm} from "react-hook-form";
import {CreateGroupDto, CreateGroupSchema} from "@features/group/utils/create-group.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Colors, defaultStyles} from "@shared/styles";
import {MediaOptions} from "@shared/components/ImagePickerComponent";
import InputField from "@shared/components/form/InputField";
import FormInput from "@shared/components/form/FormInput";
import {levelOptions} from "@features/constructor";
import BottomSheetSelect from "@shared/components/BottomSheetSelect";
import {BottomSheetTextInput} from "@gorhom/bottom-sheet";
import {useQuery} from "@tanstack/react-query";
import {getLocation} from "@features/search";
import {Ionicons} from "@expo/vector-icons";

const Create = () => {
    const [media, setMedia] = React.useState<{ actualUrl: string, thumbnailUrl: string }[]>([]);
    const [groupName, setGroupName] = React.useState<string>("");
    const [locationQuery, setLocationQuery] = useState<string>("");
    const [location, setLocation] = useState<string[]>([]);
    const [type, setType] = useState<string[]>([])


    const {data, isPending} = useQuery({
        queryKey: ['location', locationQuery],
        queryFn: () => getLocation(locationQuery),
        enabled: locationQuery.length > 0
    })
    const form = useForm<CreateGroupDto>({
        mode: "onChange",
        resolver: zodResolver(CreateGroupSchema),
    })

    useEffect(() => {
        form.setValue("location", location?.[0])
    }, [location]);

    const handleCreate = () => {
    }


    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors.dark700,
                },
                headerTintColor: "white",
                headerBackTitleVisible: false,
                title: "Quick Start",
                headerRight: () => (
                    <Button color={"success"} title={"Create"} style={{
                        paddingVertical: 8,
                    }}/>
                )
            }}/>
            <FormProvider {...form}>
                <ScrollView style={defaultStyles.container} contentContainerStyle={{paddingVertical: 12}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 130}}>
                            <MediaPicker single={true} actions={[MediaOptions.TAKE_PHOTO, MediaOptions.IMAGE]}
                                         uploadedFiles={media} addMedia={(props) => setMedia([props])}
                                         removeMedia={() => setMedia([])}/>
                        </View>
                        <FormInput name={"name"} placeholder={"Group Name"}
                                   inputStyle={{backgroundColor: "transparent"}}/>
                    </View>
                    <View style={{gap: 12, padding: 12}}>
                        <FormInput name={"description"} placeholder={"Description"}/>
                    </View>
                    <View style={{gap: 10, paddingHorizontal: 12}}>
                        <Text style={[defaultStyles.secondaryText, {fontWeight: "600"}]}>
                            Group Settings
                        </Text>
                        <View style={{backgroundColor: Colors.dark700, padding: 10, borderRadius: 12}}>
                            <BottomSheetSelect label={"Location"} placeholder={"Select Location"} value={location}
                                               onChange={(values) => setLocation(values as any)}>
                                <BottomSheetTextInput style={styles.input} value={locationQuery}
                                                      onChangeText={(text) => setLocationQuery(text)}
                                                      placeholder={"Search Location"}/>
                                <FlatList data={data?.predictions} renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => setLocation([item.description])}
                                                      style={[defaultStyles.row, {
                                                          paddingVertical: 8,
                                                          paddingHorizontal: 12
                                                      }]}>
                                        <Text style={[defaultStyles.secondaryText, [{fontWeight: "600"}]]}>
                                            {item.description}
                                        </Text>
                                        {location.includes(item.description) && (
                                            <Ionicons name={"checkmark"} size={24} color={Colors.success}/>
                                        )}
                                    </TouchableOpacity>
                                )} keyExtractor={(item) => item.place_id.toString()}/>
                            </BottomSheetSelect>
                            <BottomSheetSelect label={"Group Type"} last={true} placeholder={"Select Type"} value={type}
                                               onChange={(values) => setType(values as any)} options={[{
                                label: "Public",
                                value: "public"
                            }, {
                                label: "Private",
                                value: "private"
                            }]}/>
                        </View>
                        <View style={{gap: 10}}>
                            <Text style={[defaultStyles.secondaryText, {fontWeight: "600"}]}>
                                Group Settings
                            </Text>
                            <FormInput type={'URL'} startValue={"liftpeak.com/g/"} placeholder={"link"} name={"tag"} />
                        </View>
                    </View>
                </ScrollView>
            </FormProvider>
        </>
    );
};

export const styles = StyleSheet.create({
    input: {
        borderRadius: 8,
        backgroundColor: Colors.dark500,
        color: Colors.white,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 16,
    },
})

export default Create;