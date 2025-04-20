import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
    // Access navigation object
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            {/* Header container */}
            <View style={styles.header}>
                {/* Logo section */}
                <Image source={require('../assets/images/Logo.png')} style={styles.logo}/>

                {/* App title navigates to Home on press */}
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.title}>MovAI</Text>
                </TouchableOpacity>

                {/* Settings button navigates to Settings on press */}
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.settings}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for header container
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#2c2c2c',
    },
    // Style for logo image
    logo: {
        width: 50, 
        height: 50, 
    },
    // Style for title text
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#9b59b6',
    },
    // Style for settings button text
    settings: {
        fontSize: 20,
        color: '#9b59b6',
    },
});

export default Header;
