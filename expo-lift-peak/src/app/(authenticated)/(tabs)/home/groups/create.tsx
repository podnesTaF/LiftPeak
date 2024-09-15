import React from 'react';
import {Stack} from "expo-router";
import Button from "@shared/components/Button";
import {ScrollView, View} from "react-native";
import {MediaPicker} from "@features/media-upload";
import InputField from "@shared/components/form/InputField";
import FormField from "@shared/components/form/FormField";
import {FormProvider, useForm} from "react-hook-form";
import {CreateGroupDto, CreateGroupSchema} from "@features/group/utils/create-group.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Colors, defaultStyles} from "@shared/styles";

const Create = () => {
    const [media, setMedia] = React.useState<{actualUrl: string, thumbnailUrl: string}[]>([]);
    const [groupName, setGroupName] = React.useState<string>("");


    const form = useForm<CreateGroupDto>({
        mode: "onChange",
        resolver: zodResolver(CreateGroupSchema)
    })

    const handleCreate = () => {}


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
                 }} />
             )
         }} />
            <FormProvider {...form}>
                <ScrollView contentContainerStyle={{padding: 12}} style={defaultStyles.container}>
                   <View style={{flexDirection: "row", alignItems: 'center', gap:12}}>
                       <MediaPicker single={true} uploadedFiles={media} addMedia={(props) => setMedia([props])} removeMedia={() => setMedia([])}  />
                       <FormField name={"name"} placeholder={"Group Name"} />
                   </View>
                    <FormField name={"description"} placeholder={"Description"} />
                </ScrollView>
            </FormProvider>
        </>
    );
};

export default Create;