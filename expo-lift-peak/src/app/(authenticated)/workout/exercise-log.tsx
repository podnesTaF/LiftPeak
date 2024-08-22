import {useExerciseStore} from "@features/workout-logger";
import {defaultStyles} from "@shared/styles";
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
    </ScrollView>
  );
};



export default ExerciseLog;
