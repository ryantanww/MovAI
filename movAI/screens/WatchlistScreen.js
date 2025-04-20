import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import MovieList from '../components/MovieList';
import BackButton from '../components/BackButton';
import { PORT } from '@env';

const WatchlistScreen = () => {
    const port = PORT;

    // State to store the list of movies
    const [movies, setMovies] = useState([]);

    // State to control the loading indicator
    const [loading, setLoading] = useState(true);

    // State to store any errors
    const [error, setError] = useState(null);

    // Fetch the user's watchlist when the component mounts
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                // Get user ID and token from AsyncStorage
                const userID = await AsyncStorage.getItem('user_id');
                const token = await AsyncStorage.getItem('token');
                
                // Check if the user is authenticated
                if (!userID || !token) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }

                // Make an API call to fetch the user's watchlist
                const response = await fetch(`http://10.0.2.2:${port}/api/watchlist?userId=${userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Handle the case where the response is not ok
                if (!response.ok) {
                    setError('Failed to fetch watchlist!');
                }

                // Parse the JSON response
                const data = await response.json();
                setMovies(data);
            } catch (err) {
                // Handle any errors that occur during the fetch
                setError(err.message);
            } finally {
                // Set loading to false after the fetch is complete
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, []);

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
            {/* Display the header */}
            <Header />
            
            <View style={styles.container}>
                {/* Display the title */}
                <Text style={styles.title}>My Watchlist</Text>

                {/* Display the movie list */}
                <MovieList
                    movies={movies}
                    loading={loading}
                    error={error}
                    idKey="movie_id"
                />

                {/* Display the back button */}
                <BackButton />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Safe area style
    safeArea: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Container style
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#1e1e1e',
    },
    // Title style
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginVertical: 20,
    },
    // Loading container style
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Error container style
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Error text style
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default WatchlistScreen;
