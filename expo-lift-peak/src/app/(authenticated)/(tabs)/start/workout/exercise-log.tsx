import {useExerciseStore} from "@features/workout-logger";
import Button from "@shared/components/Button";
import {Colors, defaultStyles} from "@shared/styles";
import {useLocalSearchParams} from "expo-router";
import {Image, ScrollView, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {ExpandableSetType} from "@features/exercise-logger";
import {SetType} from "@entities/workout-log";

const ExerciseLog = () => {
  const { id } = useLocalSearchParams() as { id: string };

  const { getExerciseById, addSet } = useExerciseStore();

  const exerciseLog = getExerciseById(id);

  if (!exerciseLog) {
    return null;
  }

  const handleAddSet = () => {
    addSet(exerciseLog.id, {
      exerciseLogId: exerciseLog.id,
      order: exerciseLog.sets?.length ? exerciseLog.sets.length + 1 : 1,
      reps: 0,
      weight: 0,
      type: "workout",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };



  return (
    <ScrollView keyboardDismissMode={"on-drag"} style={[defaultStyles.container, {paddingHorizontal: 0}]}>
      {exerciseLog.exercise?.previewUrl ? (
        <Image
          source={{ uri: exerciseLog?.exercise.previewUrl }}
          style={{ width: 150, height: 150 }}
        />
      ) : (
        <Ionicons name={"barbell"} size={150} />
      )}
      <Text style={defaultStyles.header}>{exerciseLog.exercise?.name}</Text>
      <ExpandableSetType exerciseLog={exerciseLog} setType={SetType.warmup} />
      <ExpandableSetType exerciseLog={exerciseLog} setType={SetType.workout} />
      <Button onPress={handleAddSet} title={"Add Set"} color={"white"}>
        <Ionicons name={"add"} size={24} color={Colors.dark700} />
      </Button>
    </ScrollView>
  );
};



export default ExerciseLog;
