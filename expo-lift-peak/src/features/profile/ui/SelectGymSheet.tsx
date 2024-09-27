import React, {forwardRef, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {getGyms, IGym} from "@entities/gym";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";
import {useQuery} from "@tanstack/react-query";
import {BottomSheetFlatList, BottomSheetModal, BottomSheetTextInput} from "@gorhom/bottom-sheet";
import {Colors} from "@shared/styles";

interface SelectGymSheetProps {
    onSelect?: (gym: IGym) => void;
    onSubmit: (selectedGyms: IGym[]) => void;
    userGyms?: IGym[];
}

const SelectGymSheet = forwardRef<BottomSheetModal
    , SelectGymSheetProps>(({
    onSelect,
    userGyms, onSubmit}, ref) => {
    const [gymQuery, setGymQuery] = useState("")
    const [selectedGyms, setSelectedGyms] = useState([])

    const {data, isLoading} = useQuery({
        queryKey: ['gyms', gymQuery],
        queryFn: () => getGyms(gymQuery),
        enabled: !!gymQuery
    })

    const onSelectGym = (gym: IGym) => {
        if(selectedGyms.some(g => gym.address === g.address)) {
            setSelectedGyms(prev => prev.filter((g) => g.address !== gym.address))
        } else {
            setSelectedGyms(prev => [...prev, gym])
        }
        if(onSelect) {
            onSelect(gym)
        }
    }

    useEffect(() => {
        if(userGyms) {
            setSelectedGyms(userGyms)
        }
    }, [userGyms]);

    return (
        <CustomBottomSheet
            ref={ref}
            handleClose={() => {
                onSubmit(selectedGyms)
                setSelectedGyms([])
                setGymQuery("")
            }}
            snapPoints={["90%"]}
        >
           <View style={{paddingHorizontal: 12, flex: 1}}>
               <BottomSheetTextInput
                   onChangeText={(text) => setGymQuery(text)}
                   style={styles.textInput}
                   value={gymQuery}
               />
               <BottomSheetFlatList
                   contentContainerStyle={{
                       paddingBottom: 92
                   }}
                   data={
                       data
                   } renderItem={({item}) => (
                   <GymItem gym={item} onPress={onSelectGym} isSelected={!!selectedGyms.find(g => g.address === item.address)} />
               )}
                   keyExtractor={(item) => item.address}
               />
           </View>
        </CustomBottomSheet>
    );
});


export const GymItem = ({gym, onPress, isSelected}: {gym: IGym, onPress: (gym:IGym) => void, isSelected?:boolean}) => {
    return (
        <Pressable
            onPress={() => onPress(gym)}
            style={[
                styles.itemContainer,
                isSelected&&
                styles.selectedItemContainer,
            ]}
        >
            <View style={styles.itemContent}>
                <Text style={styles.gymName}>{gym.name}</Text>
                <Text style={styles.gymAddress}>{gym.address}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    textInput: {
        color: Colors.white,
        fontSize: 18,
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        backgroundColor: Colors.dark500,
    },
    itemContainer: {
        backgroundColor: Colors.dark500,
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.dark300,
    },
    selectedItemContainer: {
        borderColor: Colors.success,
    },
    itemContent: {
        justifyContent: "space-between",
        alignItems: "center",
    },
    gymName: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: "bold",
    },
    gymAddress: {
        color: Colors.white,
        fontSize: 14,
        marginTop: 4,
    },
})

export default SelectGymSheet;