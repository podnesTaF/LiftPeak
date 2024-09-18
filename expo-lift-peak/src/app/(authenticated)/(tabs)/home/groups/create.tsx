import React, {useEffect, useState} from 'react';
import {Stack, useRouter} from "expo-router";
import Button from "@shared/components/Button";
import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    FlatList,
    KeyboardAvoidingView, ActivityIndicator
} from "react-native";
import {MediaPicker} from "@features/media-upload";
import {FormProvider, useForm} from "react-hook-form";
import {CreateGroupDto, CreateGroupSchema} from "@features/group/utils/create-group.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Colors, defaultStyles} from "@shared/styles";
import FormInput from "@shared/components/form/FormInput";
import BottomSheetSelect, {OptionItem} from "@shared/components/BottomSheetSelect";
import {BottomSheetTextInput} from "@gorhom/bottom-sheet";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getLocation} from "@features/search";
import {CreateGroup} from "@features/group/api/groupApi";
import {MediaOptions} from "@shared/model/IMediaOption";

const Create = () => {
    const router = useRouter();
    const [media, setMedia] = React.useState<{ actualUrl: string, thumbnailUrl: string }[]>([]);
    const [groupName, setGroupName] = React.useState<string>("");
    const [locationQuery, setLocationQuery] = useState<string>("");
    const [location, setLocation] = useState<string[]>([]);
    const [type, setType] = useState<string[]>([])


    const {data, isLoading} = useQuery({
        queryKey: ['location', locationQuery],
        queryFn: () => getLocation(locationQuery),
        enabled: locationQuery.length > 0
    })

    const {mutate, isPending} = useMutation({
        mutationFn: (dto: CreateGroupDto) => CreateGroup(dto),
        onSuccess: data => (
            router.push("/(authenticated)/(tabs)/home/groups/" + data.id)
        )
    })

    const form = useForm<CreateGroupDto>({
        mode: "onChange",
        resolver: zodResolver(CreateGroupSchema),
    })

    useEffect(() => {
        form.setValue("location", location?.[0])
    }, [location]);

    useEffect(() => {
        form.setValue("pictureUrl", media?.[0]?.actualUrl)
    }, [media]);

    useEffect(() => {
        form.setValue("type", type?.[0] as any)
    }, [type]);

    const handleCreate = (dto: CreateGroupDto) => {
        mutate(dto)
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
                title: "Create Group",
                headerRight: () => (
                    <Button color={"success"} onPress={form.handleSubmit(handleCreate)} title={"Create"} style={{
                        paddingVertical: 8,
                    }}>
                        {isPending && <ActivityIndicator color={"white"} size={12} />}
                    </Button>
                )
            }}/>
            <FormProvider {...form}>
                <KeyboardAvoidingView style={defaultStyles.container}>
                    <ScrollView contentContainerStyle={{paddingVertical: 12}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: 130}}>
                                <MediaPicker single={true} actions={[MediaOptions.TAKE_PHOTO, MediaOptions.IMAGE]}
                                             uploadedFiles={media} addMedia={(props) => setMedia([props])}
                                             removeMedia={() => setMedia([])}/>
                            </View>
                            <FormInput name={"name"} placeholder={"Group Name"}
                                       inputStyle={{backgroundColor: "transparent"}} />
                        </View>
                        <View style={{gap: 12, padding: 12}}>
                            <FormInput name={"description"} placeholder={"Description"} multiline={true}/>
                        </View>
                        <View style={{gap: 10, paddingHorizontal: 12}}>
                            <Text style={[defaultStyles.secondaryText, {fontWeight: "600"}]}>
                                Group Settings
                            </Text>
                            <View style={{backgroundColor: Colors.dark700, paddingHorizontal: 10, borderRadius: 12}}>
                                <BottomSheetSelect label={"Location"} placeholder={"Select Location"} value={location}
                                                   onChange={(values) => setLocation(values as any)}>
                                    <BottomSheetTextInput placeholderTextColor={Colors.dark300} style={styles.input} value={locationQuery}
                                                          onChangeText={(text) => setLocationQuery(text)}
                                                          placeholder={"Search Location"} />
                                    {isLoading ? (
                                        <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
                                            <ActivityIndicator color={Colors.success} size={60} />
                                        </View>
                                    ) : (data?.predictions?.length || 0) < 1 ? (
                                            <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
                                                <Text style={{fontSize: 24, fontWeight: 600, color: "white"}}>
                                                    Search For Location
                                                </Text>
                                            </View>
                                    ) : <FlatList data={data?.predictions} renderItem={({item, index}) => (
                                        <View style={{
                                            paddingHorizontal: 12,
                                            paddingTop: 12,
                                            borderBottomColor: Colors.dark500,
                                            borderBottomWidth: StyleSheet.hairlineWidth
                                        }}>
                                            <OptionItem
                                                option={{label: item.description, value: item.description}}
                                                selectedValues={location}
                                                handleCheckboxChange={() => setLocation([item.description])}
                                            />
                                        </View>
                                    )} keyExtractor={(item) => item.place_id.toString()}/>}
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
                                <FormInput type={'URL'} startValue={"liftpeak.com/g/"} placeholder={"link"} name={"groupTag"} />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        marginHorizontal: 12,
    },
})

export default Create;