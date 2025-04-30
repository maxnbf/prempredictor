import "react-native-gesture-handler"; // FIRST import
import "react-native-reanimated"; // SECOND import
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import store, { AppDispatch } from "./redux/store";
import { signInResponse } from "./redux/reducers/auth";
import { setAuthToken } from "./actions/util";
import Login from "./components/auth/Login";
import { Home } from "./components/home/Home";
import Register from "./components/auth/Register";
import { Groups } from "./components/all/Groups";
import { ProfileView } from "./components/profile/Profile";
import {
  TabParamList,
  RootStackParamList,
  GroupsStackParamList,
  ProfileStackParamList,
} from "./types/routes";
import { enableScreens } from "react-native-screens";
import { navigationRef } from "./navigation/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NewUserOnboarding } from "./components/home/onboarding/NewUserOnboarding";
import { SingleTable } from "./components/all/SingleTable";
import { fetchLogos } from "./redux/reducers/logos";
import { Friends } from "./components/profile/friends/Friends";
import { PrivacyPolicy } from "./components/profile/PrivacyPolicy";

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const GroupsStack = createNativeStackNavigator<GroupsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen
        name="ProfileHome"
        component={ProfileView}
        options={{ title: "Profile" }}
      />
      <ProfileStack.Screen
        name="Friends"
        component={Friends}
        options={() => ({
          title: "Friends",
          headerBackTitleVisible: false,
          headerShown: true,
        })}
      />
      <ProfileStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={() => ({
          title: "Privacy Policy",
          headerBackTitleVisible: false,
          headerShown: true,
        })}
      />
    </ProfileStack.Navigator>
  );
};

const GroupsNavigator = () => {
  return (
    <GroupsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <GroupsStack.Screen
        name="GroupHome"
        component={Groups}
        options={{ title: "Groups" }}
      />
      <GroupsStack.Screen
        name="Table"
        component={SingleTable}
        options={({ route }) => ({
          title: route.params.type,
          headerBackTitleVisible: false,
          headerShown: true,
        })}
      />
    </GroupsStack.Navigator>
  );
};

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
        name="Groups"
        component={GroupsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
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
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const logosLoading = useSelector((state: any) => state.logos.loading);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      const username = await AsyncStorage.getItem("username");

      if (token && username && !isAuthenticated) {
        setAuthToken(token);
        dispatch(signInResponse({ username, token }));
      }

      await dispatch(fetchLogos());
      setLoading(false);
    };

    restoreAuth();
  }, []);

  if (loading || logosLoading) return null; // Show a splash/loading screen here if needed

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

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000000", // <- black instead of purple
    onPrimary: "#ffffff", // <- text/icons on top of primary (usually white)
    secondary: "#666666", // <- optional, in case secondary is used
    background: "#ffffff", // <- app background
    surface: "#ffffff", // <- cards/menus background
    text: "#000000", // <- default text color
    onSurface: "#000000", // <- text/icon color for surfaces like TextInput/Menu
    outline: "#cccccc", // <- borders (like TextInput outline)
    inversePrimary: "#ffffff", // <- inverse primary color (used in dark mode)
    tertiary: "#000000", // <- optional, in case tertiary is used
    onSecondary: "#ffffff", // Text on secondary
    elevation: {
      // used for Menu
      level0: "#ffffff", // Light gray shadow
      level1: "#ffffff", // Medium gray shadow
      level2: "#ffffff", // Darker gray shadow
      level3: "#ffffff", // Even darker shadow
      level4: "#ffffff", // Deep shadow
      level5: "#ffffff", // Deep shadow
    },
  },
};

const App = () => (
  <GestureHandlerRootView>
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </PaperProvider>
  </GestureHandlerRootView>
);

export default App;
