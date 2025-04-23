// navigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import { resetStore } from '../redux/reducers/auth';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigateToLogin = async () => {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("username");
  
    store.dispatch(resetStore());
  
    if (navigationRef.isReady()) {
      navigationRef.navigate("Login");
    }
  };