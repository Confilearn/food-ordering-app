import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
  // Import fonts
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  // Show app only when fonts is loaded
  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync;
  }, [fontsLoaded, error]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
