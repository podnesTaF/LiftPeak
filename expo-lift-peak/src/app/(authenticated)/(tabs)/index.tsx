import {StyleSheet, Text, View} from 'react-native';

import {useQuery} from "@tanstack/react-query";
import api from "@shared/api/AxiosInstance";
import React from "react";

export default function TabOneScreen() {
  const {data} = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
        const {data} = await api.get("/users/profile");
        return data;
    }
  })
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
        <Text>{JSON.stringify(data)}</Text>
      <View style={styles.separator} />
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
