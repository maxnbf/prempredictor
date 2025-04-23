import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Onboarding: undefined; 
    Main: NavigatorScreenParams<TabParamList>
}

export type TabParamList = {
    Home: { username: string | undefined; gameweek: string | undefined };
    All: undefined;
    Profile: undefined;
}
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;
export type HomeScreenProps = BottomTabNavigationProp<TabParamList, 'Home'>;
export type HomeRouteProp = RouteProp<TabParamList, 'Home'>;
export type AllScreenProps = BottomTabNavigationProp<TabParamList, 'All'>;
export type ProfileScreenProps = BottomTabNavigationProp<TabParamList, 'Profile'>;
export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
