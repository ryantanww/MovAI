import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { PORT } from '@env';

const LoginScreen = () => {
    const port = PORT;

    // Access the navigation object
    const navigation = useNavigation();

    // State to store username or email input
    const [usernameOrEmail, setUsernameOrEmail] = useState('');

    // State to store password input
    const [password, setPassword] = useState('');

    // State to store messages for errors or login status
    const [message, setMessage] = useState('');

    // Function to handle login
    const handleLogin = async () => {
        try {
            // Make a POST request to login endpoint
            const response = await fetch(`http://10.0.2.2:${port}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail, password }),
            });
            
            // Parse the response data
            const resData = await response.json();
            
            if (response.ok) {
                // Store token and user ID in AsyncStorage if login is successful
                const token = resData.token;
                const userID = resData.user_id;
            
                if (token) {
                    await AsyncStorage.setItem('token', token);
                }

                if (userID) {
                    await AsyncStorage.setItem('user_id', userID.toString());
                } else {
                    console.warn('User ID is undefined or null', userID);
                }
            
                // Navigate to home screen upon successful login
                navigation.navigate('Home');
            } else {
                // Display error message for invalid login credentials
                setMessage(resData.msg || 'Invalid login credentials');
            }
        } catch (err) {
            console.error('Error during fetch:', err);
            setMessage(`An unexpected error occurred: ${err.message}`);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Render the header component */}
            <Header />
            <View style={styles.container}>
                {/* Display the login title */}
                <Text style={styles.title}>Log In</Text>

                {/* Form inputs for username/email and password */}
                <View style={styles.formContainer}>
                    <TextInput
                        placeholder="Username or Email"
                        value={usernameOrEmail}
                        onChangeText={setUsernameOrEmail}
                        style={styles.input}
                        placeholderTextColor="#9b59b6"
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#9b59b6"
                    />

                    {/* Button to trigger login */}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>

                    {/* Display any error or status message */}
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                </View>

                {/* Display 'or' between login and sign-up */}
                <View style={styles.orContainer}>
                    <View style={styles.line}></View>
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.line}></View>
                </View>

                {/* Button to navigate to sign-up screen */}
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.altButton}>
                    <Text style={styles.altButtonText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Spacer and back button */}
                <View style={styles.spacer}></View>
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
    // Style for the login title
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9b59b6',
        textAlign: 'center',
        marginBottom: 20,
    },
    // Style for the form container
    formContainer: {
        borderWidth: 1,
        borderColor: '#9b59b6',
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#2c2c2c',
    },
    // Style for the text input fields
    input: {
        height: 50,
        borderColor: '#9b59b6',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: '#000',
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    // Style for the login button
    button: {
        backgroundColor: '#9b59b6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Style for the login button text
    buttonText: {
        fontSize: 18,
        color: '#ecf0f1',
        fontWeight: 'bold',
    },
    // Style for displaying error or status messages
    message: {
        marginTop: 20,
        color: '#e74c3c',
        textAlign: 'center',
    },
    // Style for the 'or' container
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    // Style for the horizontal line
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#9b59b6',
    },
    // Style for the 'or' text
    orText: {
        marginHorizontal: 10,
        color: '#9b59b6',
        fontSize: 16,
    },
    // Style for the sign-up button
    altButton: {
        borderWidth: 1,
        borderColor: '#9b59b6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Style for the sign-up button text
    altButtonText: {
        fontSize: 18,
        color: '#9b59b6',
        fontWeight: 'bold',
    },
    // Spacer to push elements up/down
    spacer: {
        flex: 1,
    },
});

export default LoginScreen;
