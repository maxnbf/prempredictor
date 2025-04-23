import "react-native-gesture-handler"; // FIRST import
import "react-native-reanimated"; // SECOND import
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import store from "./redux/store";
import { signInResponse } from "./redux/reducers/auth";
import { setAuthToken } from "./actions/util";
import Login from "./components/auth/Login";
import { Home } from "./components/home/Home";
import Register from "./components/auth/Register";
import { All } from "./components/all/All";
import Profile from "./components/profile/Profile";
import { TabParamList, RootStackParamList } from "./types/routes";
import { enableScreens } from "react-native-screens";
import { navigationRef } from "./navigation/navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NewUserOnboarding } from "./components/home/onboarding/NewUserOnboarding";

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab Navigator for Home, All, and Profile
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Disable the header since we'll have a bottom tab navigator
        tabBarActiveTintColor: "#e91e63", // Active icon color
        tabBarInactiveTintColor: "gray", // Inactive icon color
        tabBarStyle: { backgroundColor: "#fff", height: 60, paddingBottom: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="All"
        component={All}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigator that checks for authentication
const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      const username = await AsyncStorage.getItem("username");

      if (token && username && !isAuthenticated) {
        setAuthToken(token);
        dispatch(signInResponse({ username, token }));
      }

      setLoading(false);
    };

    restoreAuth();
  }, []);

  if (loading) return null; // Show a splash/loading screen here if needed

  // OHHHH... ALL OF THE "Do you have Screen ___" literally refers to the screens not existing here. Think of a better way to do this
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ animation: "none" }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ animation: "none" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
              component={NewUserOnboarding}
              options={{ animation: "none" }}
            />
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ animation: "none" }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ animation: "none" }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ animation: "none" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <GestureHandlerRootView>
    <PaperProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </PaperProvider>
  </GestureHandlerRootView>
);

export default App;
