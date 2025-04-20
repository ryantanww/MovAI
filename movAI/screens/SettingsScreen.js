import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { PORT } from '@env';

const SettingsScreen = () => {
    const port = PORT;

    // Access the navigation object
    const navigation = useNavigation();
    
    // State to store the username
    const [username, setUsername] = useState(null);

    // Fetch the username when the component mounts
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const userId = await AsyncStorage.getItem('user_id');
                const token = await AsyncStorage.getItem('token');
                if (userId && token) {
                    const response = await fetch(`http://10.0.2.2:${port}/api/user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const resData = await response.json();
                    if (response.ok) {
                        // Set the username from the response data
                        setUsername(resData.username);
                    } else {
                        console.error('Failed to fetch username');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUsername();
    }, []);

    // Handle logout action
    const handleLogout = async () => {
        await AsyncStorage.removeItem('user_id');
        await AsyncStorage.removeItem('token');
        setUsername(null);
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Display the header */}
            <Header />
            <View style={styles.container}>
                {/* Display user-specific settings if logged in, else show sign-up/login options */}
                {username ? (
                    <View>
                        <Text style={styles.welcomeText}>Welcome, {username}</Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Watchlist')}
                        >
                            <Text style={styles.buttonText}>Watchlist</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('FAQ')}
                        >
                            <Text style={styles.buttonText}>FAQ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('About')}
                        >
                            <Text style={styles.buttonText}>About</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleLogout} style={styles.altButton}>
                            <Text style={styles.altButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.title} testID="settings-title">Settings</Text>
                        
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('FAQ')}
                        >
                            <Text style={styles.buttonText}>FAQ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('About')}
                        >
                            <Text style={styles.buttonText}>About</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.spacer}></View>
                {/* Display the back button */}
                <View>
                    <BackButton />
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for the safe area
    safeArea: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the main container
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1e1e1e',
    },
    // Style for the welcome text
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9b59b6',
        textAlign: 'center',
        marginBottom: 20,
    },
    // Style for the title text
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9b59b6',
        textAlign: 'center',
        marginBottom: 40,
    },
    // Style for the buttons
    button: {
        backgroundColor: '#9b59b6',
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Style for the button text
    buttonText: {
        fontSize: 18,
        color: '#ecf0f1',
        fontWeight: 'bold',
    },
    // Style for the alternate button (e.g., Logout)
    altButton: {
        borderWidth: 1,
        borderColor: '#9b59b6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    // Style for the alternate button text
    altButtonText: {
        fontSize: 18,
        color: '#9b59b6',
        fontWeight: 'bold',
    },
    // Spacer to push content up or down
    spacer: {
        flex: 1,
    },
});

export default SettingsScreen;
