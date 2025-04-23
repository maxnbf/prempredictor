// navigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import { resetStore } from '../redux/reducers/auth';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigateToLogin = async () => {
    await AsyncStorage.removeItem("jwtToken");
    store.dispatch(resetStore());
    console.log("Is nav ready:", navigationRef.isReady());
    console.log("root state:", navigationRef.getRootState());
    console.log("Current Route:", navigationRef.getCurrentRoute()?.name);

  
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };