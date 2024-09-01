import React from 'react';
import {Pressable, Text, View} from "react-native";
import TableHead from "./ExerciseTableHead";
import ExerciseSetRow from "./ExerciseSetRow";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {IExerciseLog, SetType} from "@entities/workout-log";
import {useExerciseStore} from "@features/workout-logger";
import Button from "@shared/components/Button";

interface SetsTableProps {
    exerciseLog: IExerciseLog;
}

const SetsTable = ({exerciseLog}: SetsTableProps) => {
    const {addSet,removeSet} = useExerciseStore()

    const handleAddSet = (type: SetType) => {
        addSet(exerciseLog.id, {
            exerciseLogId: exerciseLog.id,
            order: exerciseLog.sets?.length ? exerciseLog.sets?.length + 1: 1,
            reps: 0,
            weight: 0,
            timeInS: 0,
            distanceInM: 0,
            type: type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    };

    const handleRemoveSet = () => {
        if(exerciseLog.sets?.length) {
            removeSet(exerciseLog.id, exerciseLog.sets[exerciseLog.sets.length - 1].id);
        }
    }

    return (
       <View>
           {exerciseLog.sets?.length ? (
                   <>
                       <TableHead metric={exerciseLog.exercise?.metric} />
                       {exerciseLog.sets?.map((set, index) => (
                           <ExerciseSetRow
                               key={set.id}
                               exerciseLogId={exerciseLog.id}
                               set={set}
                               index={index}
                               metric={exerciseLog.exercise?.metric}
                           />
                       ))}
                   </>
               ) : (
                    <View style={{paddingVertical: 12, alignItems: 'center', width: "100%"}}>
                        <Text style={defaultStyles.secondaryText}>
                            Add sets for this exercise
                        </Text>
                    </View>
               )}
           <View style={{flexDirection: "row", gap: 8, marginVertical: 8}}>
               {exerciseLog.sets?.length ? (
                   <Button color={"dark500"} style={{flex: 1, paddingVertical: 8}} onPress={handleRemoveSet} >
                       <Ionicons name={"remove"}  size={24} color={Colors.white} />
                   </Button>
               ) : (
                   <Button color={"success"} style={{flex: 1,  paddingVertical: 8}} onPress={() => handleAddSet(SetType.warmup)} title={"Warm-up"} />
               )}
               <Button onPress={() => handleAddSet(SetType.workout)} color={"dark500"} style={{flex: 1,  paddingVertical: 8}}>
                   <Ionicons name={"add"} size={24} color={Colors.white} />
               </Button>
           </View>
       </View>
    );
};

export default SetsTable;