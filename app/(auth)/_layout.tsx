import { Slot } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthLayout = () => {
  return (
    <SafeAreaView>
      <Text>authLayout</Text>
      <Slot />
    </SafeAreaView>
  );
};

export default AuthLayout;
