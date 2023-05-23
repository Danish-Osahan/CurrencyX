import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import HomeScreen from "./screens/HomeScreen";
import MainScreen from "./screens/MainScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  const [loaded] = useFonts({
    Orbitron: require("./assets/fonts/Orbitron-VariableFont_wght.ttf"),
    OrbitronBold: require("./assets/fonts/Orbitron-Bold.ttf"),
    OrbitronMedium: require("./assets/fonts/Orbitron-Medium.ttf"),
    MonstratMedium: require("./assets/fonts/Montserrat-Medium.ttf"),
    MonstratSemiBold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
    MonstratLight: require("./assets/fonts/Montserrat-Light.ttf"),
    MonstratExtraLight: require("./assets/fonts/Montserrat-ExtraLight.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
