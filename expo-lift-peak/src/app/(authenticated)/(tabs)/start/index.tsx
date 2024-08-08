import {StyleSheet, View} from 'react-native';
import Button from "@shared/components/Button";
import {Link, useRouter} from "expo-router";
import {useEffect, useLayoutEffect} from "react";
import {useWorkoutStore} from "@features/workout-logger";


export default function TabTwoScreen() {
  const router = useRouter();
  const {workout} = useWorkoutStore();

  useEffect(() => {
    if (workout) {
      router.replace({
        pathname: "/(authenticated)/(tabs)/start/workout",
      });
    }
  }, [workout, router]);

  return (
    <View style={styles.container}>
      <Link href={"/(authenticated)/(tabs)/start/workout"} asChild>
        <Button title={"Quick Start"} color={"dark700"} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
