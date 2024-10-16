import React, { useEffect } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Profile from "@features/profile/ui/Profile";

const GeneralProfile = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const userId = id ? parseInt(id, 10) : null;

  return <>{userId ? <Profile userId={userId} /> : null}</>;
};


export default GeneralProfile;
