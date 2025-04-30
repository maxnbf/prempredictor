// navigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import { resetStore } from '../redux/reducers/auth';
import { setAuthToken } from '../actions/util';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const logoutUser = async () => {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("username");
  
    setAuthToken(null);
    store.dispatch(resetStore());
  
    if (navigationRef.isReady()) {
      navigationRef.navigate("Login");
    }
  };