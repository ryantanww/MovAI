import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ChatbotScreen from '../screens/ChatbotScreen';


// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // Set the icon for each tab based on the route
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Categories') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Chatbot') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#9b59b6', 
                tabBarInactiveTintColor: '#FFFFFF',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
            })}
        >
            {/* Tab for HomeScreen */}
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            
            {/* Tab for CategoriesScreen */}
            <Tab.Screen name="Categories" component={CategoriesScreen} options={{ headerShown: false }} />
            
            {/* Tab for ChatbotScreen */}
            <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    // Style for the tab bar
    tabBar: {
        backgroundColor: '#2c2c2c', 
        borderTopColor: '#2c2c2c'
    },
    // Style for the tab labels
    tabBarLabel: {
        fontSize: 12,
        paddingBottom: 5 
    },
    // Style for active icons if needed
    iconActive: {
        borderWidth: 2, 
        borderColor: '#9b59b6', 
        borderRadius: 20 
    }
});

export default BottomTab;
