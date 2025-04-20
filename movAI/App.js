import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MovieDetailScreen from './screens/MovieDetailScreen';
import BottomTab from './components/BottomTab';
import CategoryScreen from './screens/CategoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignUpScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import FAQScreen from './screens/FAQScreen';
import AboutScreen from './screens/AboutScreen';

// Create a stack navigator instance
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        {/* Define the stack navigator with various screens */}
        <Stack.Navigator initialRouteName="BottomTab">
            
            {/* BottomTab screen (home) */}
            <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />

            {/* Movie Detail screen */}
            <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ headerShown: false }} />

            {/* Category screen for showing movies in specific categories */}
            <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }} />

            {/* Settings screen */}
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />

            {/* Sign-up screen */}
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

            {/* Login screen */}
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

            {/* Watchlist screen to show user's saved movies */}
            <Stack.Screen name="Watchlist" component={WatchlistScreen} options={{ headerShown: false }} />

            {/* Search results screen */}
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: false }} />

            {/* FAQ screen */}
            <Stack.Screen name="FAQ" component={FAQScreen} options={{ headerShown: false }} />

            {/* About screen */}
            <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
