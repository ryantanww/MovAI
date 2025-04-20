import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { searchMovies } from '../tmdbApi';
import Header from '../components/Header';
import MovieList from '../components/MovieList';
import BackButton from '../components/BackButton';

const SearchResultsScreen = () => {
    // Access the route object
    const route = useRoute();

    // Destructure query from route parameters
    const { query } = route.params;

    // State for storing search results (movies)
    const [movies, setMovies] = useState([]);

    // State for controlling the loading indicator
    const [loading, setLoading] = useState(true);

    // State for storing any errors
    const [error, setError] = useState(null);

    // Fetch search results when the component mounts or query changes
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                // Fetch movies based on the search query
                const results = await searchMovies(query);
                setMovies(results);
            } catch (error) {
                // Set error message if the fetch fails
                setError('Failed to load search results.');
            } finally {
                // Set loading to false after fetch is complete
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    // Display a loading indicator while fetching data
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9b59b6" />
            </View>
        );
    }
    
    // Display an error message if an error occurs
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Render the header component */}
            <Header />
            <View style={styles.container}>
                {/* Display the search results title */}
                <Text style={styles.title}>Search Results</Text>

                {/* Display the movie list with search results */}
                <MovieList
                    movies={movies}
                    loading={loading}
                    error={error}
                    idKey="id"
                />

                {/* Display the back button */}
                <BackButton />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for the safe area container
    safeArea: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the main container
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#1e1e1e',
    },
    // Style for the title text
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginVertical: 20,
    },
    // Style for the loading container
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Style for the error container
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Style for the error text
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default SearchResultsScreen;
