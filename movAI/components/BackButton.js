import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    // Access navigation object
    const navigation = useNavigation();

    return (
        // TouchableOpacity to trigger goBack navigation on press
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Style for the back button
    backButton: {
        backgroundColor: '#9b59b6',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    // Style for the text inside the back button
    backButtonText: {
        color: '#ecf0f1',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default BackButton;
