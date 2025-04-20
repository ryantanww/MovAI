import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { PORT } from '@env';

const SignUpScreen = () => {
    const port = PORT;

    // Access navigation object
    const navigation = useNavigation();
    
    // State for storing username input
    const [username, setUsername] = useState('');

    // State for storing email input
    const [email, setEmail] = useState('');

    // State for storing password input
    const [password, setPassword] = useState('');

    // State for storing messages (errors or success)
    const [message, setMessage] = useState('');

    // Handle the sign-up process
    const handleSignUp = async () => {
        if (!username || !email || !password) {
            // Show error if fields are missing
            setMessage('All fields are required.');
            return;
        }

        try {
            // Make an API request to sign up the user
            const response = await fetch(`http://10.0.2.2:${port}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            
            const contentType = response.headers.get('Content-Type');
        
            if (!response.ok) {
                // Handle server errors
                const errorText = await response.text();
                console.error('Server Error:', errorText);
        
                if (contentType && contentType.includes('application/json')) {
                    const errorJson = JSON.parse(errorText);
                    setMessage(errorJson.msg || 'An error occurred.');
                } else {
                    setMessage('An unexpected error occurred. Please try again.');
                }
                return;
            }

            if (contentType && contentType.includes('application/json')) {
                // Show success message and navigate to the login screen
                const resData = await response.json();
                setMessage(resData.msg);
                navigation.navigate('Login');
            } else {
                setMessage('Unexpected response format.');
            }
        } catch (err) {
            // Handle any errors during the fetch
            console.error('Error during fetch:', err);
            setMessage(`An unexpected error occurred: ${err.message}`);
        }
    };
    
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Render the header component */}
            <Header />

            <View style={styles.container}>
                {/* Sign-up title */}
                <Text style={styles.title}>Sign Up</Text>

                <View style={styles.formContainer}>
                    {/* Username input field */}
                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        placeholderTextColor="#9b59b6"
                    />

                    {/* Email input field */}
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholderTextColor="#9b59b6"
                    />

                    {/* Password input field */}
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#9b59b6"
                    />

                    {/* Sign-up button */}
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Display message if there is one */}
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                </View>

                <View style={styles.orContainer}>
                    {/* "or" divider */}
                    <View style={styles.line}></View>
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.line}></View>
                </View>

                {/* Log-in button */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.altButton}>
                    <Text style={styles.altButtonText}>Log In</Text>
                </TouchableOpacity>

                <View style={styles.spacer}></View>

                {/* Back button */}
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
    // Style for the sign-up title text
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
    // Style for input fields
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
    // Style for the sign-up button
    button: {
        backgroundColor: '#9b59b6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Style for the sign-up button text
    buttonText: {
        fontSize: 18,
        color: '#ecf0f1',
        fontWeight: 'bold',
    },
    // Style for displaying messages (errors/success)
    message: {
        marginTop: 20,
        color: '#e74c3c',
        textAlign: 'center',
    },
    // Style for the "or" container
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    // Style for the horizontal line in the "or" section
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#9b59b6',
    },
    // Style for the "or" text
    orText: {
        marginHorizontal: 10,
        color: '#9b59b6',
        fontSize: 16,
    },
    // Style for the alternate (Log In) button
    altButton: {
        borderWidth: 1,
        borderColor: '#9b59b6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Style for the alternate button text
    altButtonText: {
        fontSize: 18,
        color: '#9b59b6',
        fontWeight: 'bold',
    },
    // Style for spacer to push the back button down
    spacer: {
        flex: 1,
    },
});

export default SignUpScreen;
