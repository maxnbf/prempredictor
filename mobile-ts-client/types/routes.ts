import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Onboarding: undefined;
    Main: NavigatorScreenParams<TabParamList>;
};
  
export type TabParamList = {
    Home: { username: string | undefined; gameweek: string | undefined };
    Groups: NavigatorScreenParams<GroupsStackParamList>;
    Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type GroupsStackParamList = {
    GroupHome: undefined;
    Table: { type: string };
};

export type ProfileStackParamList = {
    ProfileHome: undefined;
    Friends: undefined;
}


// Need to learn more about these. I think some are redundant. Dont need to make one for each screen if it does the same thing
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;
export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export type HomeScreenProps = BottomTabNavigationProp<TabParamList, 'Home'>;
export type GroupHomeScreenProps = BottomTabNavigationProp<GroupsStackParamList, 'GroupHome'>;
export type TableScreenProps = BottomTabNavigationProp<GroupsStackParamList, 'Table'>;
export type ProfileScreenProps = BottomTabNavigationProp<ProfileStackParamList, 'ProfileHome'>;
export type FriendScreenProps = BottomTabNavigationProp<ProfileStackParamList, 'Friends'>;

export type HomeRouteProps = RouteProp<TabParamList, 'Home'>;
export type TableRouteProps = RouteProp<GroupsStackParamList, 'Table'>;
  