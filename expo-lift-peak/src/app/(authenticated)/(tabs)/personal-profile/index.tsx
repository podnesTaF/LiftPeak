import { useAuthStore } from "@features/auth";
import React from "react";
import Profile from "@features/profile/ui/Profile";

const PersonalProfile = () => {
  const { user} = useAuthStore();
 
  return <>{user?.id ? <Profile userId={user.id} /> : null}</>;
};

export default PersonalProfile;
