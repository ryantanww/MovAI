import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BackButton from '../components/BackButton';

const AboutScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Render the header component */}
            <Header />
            
            {/* Scrollable content for the about section */}
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                
                {/* Title of the About page */}
                <Text style={styles.title}>About MovAI</Text>

                {/* Description of the app and its features */}
                <Text style={styles.description}>
                    Welcome to movAI, your personal movie exploration and watchlist application. 
                    movAI allows you to browse trending, popular, and top-rated movies, along with personalized movie recommendations based on random genres. 
                    You can search for movies, view detailed information, and add your favorites to a watchlist for easy access. 
                    The cool thing about movAI is the AI chatting feature where you can ask queries and get back recommendations from the AI.
                </Text>

                {/* Additional description about the app's immersive experience */}
                <Text style={styles.description}>
                    Our application is designed to provide an immersive experience for movie lovers. Whether you're looking for the latest hits or discovering hidden gems, 
                    movAI has you covered. Enjoy seamless navigation through various movie categories, explore new genres, and stay updated with the latest trends.
                </Text>

                {/* Mention of TMDB as the source of movie data */}
                <Text style={styles.description}>
                    All movie data in movAI is sourced from The Movie Database (TMDB). TMDB provides up-to-date data on movies, TV shows, actors, and more.
                </Text>
            </ScrollView>

            {/* Render the back button component */}
            <BackButton />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for the safe area container
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the scroll view content container
    scrollViewContent: {
        padding: 20,
    },
    // Style for the title of the about screen
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9b59b6',
        textAlign: 'center',
        marginBottom: 20,
    },
    // Style for the description text
    description: {
        fontSize: 16,
        color: '#bdc3c7',
        marginBottom: 20,
        lineHeight: 22,
        textAlign: 'justify',
    },
});

export default AboutScreen;
