import { Redirect, Slot } from "expo-router";

const TabLayout = () => {
  const isAuthenticated = false;

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return <Slot />;
};

export default TabLayout;
