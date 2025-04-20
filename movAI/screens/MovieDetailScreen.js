import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMovieDetails } from '../tmdbApi';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { PORT } from '@env';

const MovieDetailScreen = () => {
    const port = PORT;
    
    // Access the route objects
    const route = useRoute();
    
    // Destructure movieId from route params
    const { movieId } = route.params;

    // State to store movie details
    const [movieDetails, setMovieDetails] = useState(null);

    // State to track if the movie is in the user's watchlist
    const [watchlist, setWatchlist] = useState(null);

    // State to store the user ID
    const [userId, setUserId] = useState(null);

    // State to track any errors
    const [error, setError] = useState(null);

    // Fetch movie details and check if the movie is in the watchlist
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const details = await getMovieDetails(movieId);
                setMovieDetails(details);
            } catch (error) {
                setMovieDetails(null);
                setError('Failed to fetch movie details!');
            }
        };

        const checkWatchlist = async () => {
            try {
                const user_id = await AsyncStorage.getItem('user_id');
                const token = await AsyncStorage.getItem('token');
                
                if (user_id && token) {
                    setUserId(user_id);

                    const response = await fetch(`http://10.0.2.2:${port}/api/watchlist?userId=${user_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    const movieInWatchlist = data.find(item => item.movie_id === movieId);
                    setWatchlist(!!movieInWatchlist);
                }
            } catch (error) {
                console.error('Error checking watchlist:', error);
            }
        };

        fetchMovieDetails();
        checkWatchlist();
    }, [movieId]);

    // Add movie to watchlist
    const addToWatchlist = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await fetch(`http://10.0.2.2:${port}/api/watchlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    movieId: movieDetails.id,
                    title: movieDetails.title,
                    posterPath: movieDetails.poster_path,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setWatchlist(true);
                Alert.alert('Success', 'Movie added to your watchlist!');
            } else {
                Alert.alert('Error', 'Failed to add movie to watchlist.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add movie to watchlist.');
        }
    };

    // Remove movie from watchlist
    const removeFromWatchlist = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await fetch(`http://10.0.2.2:${port}/api/watchlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    movieId: movieDetails.id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setWatchlist(false);
                Alert.alert('Success', 'Movie removed from your watchlist!');
            } else {
                Alert.alert('Error', data.error || 'Failed to remove movie from watchlist.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to remove movie from watchlist.');
        }
    };

    // Toggle movie in watchlist
    const toggleWatchlist = () => {
        if (!userId) {
            Alert.alert('Error', 'No user logged in. Please log in to add to watchlist.');
            return;
        }

        if (watchlist) {
            removeFromWatchlist();
        } else {
            addToWatchlist();
        }
    };

    // Display a loading indicator if data is still being fetched
    if (!movieDetails && !error) {
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
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    {/* Display the movie poster */}
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
                        style={styles.poster}
                    />
                    <View style={styles.detailsContainer}>
                        {/* Display the movie title */}
                        <Text style={styles.title}>{movieDetails.title}</Text>

                        {/* Watchlist button */}
                        <TouchableOpacity onPress={toggleWatchlist} style={styles.watchlistButton}>
                            <Text style={styles.watchlistButtonText}>
                                {watchlist ? '❤️ Remove from Watchlist' : '🤍 Add to Watchlist'}
                            </Text>
                        </TouchableOpacity>

                        {/* Display rating and vote count */}
                        <View style={styles.row}>
                            <Text style={styles.header}>Rating:</Text>
                            <Text style={styles.header}>Vote Count:</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detail}>{movieDetails.vote_average}</Text>
                            <Text style={styles.detail}>{movieDetails.vote_count}</Text>
                        </View>

                        {/* Display release date, languages, and genres */}
                        <Text style={styles.header}>Release Date:</Text>
                        <Text style={styles.detail}>{movieDetails.release_date}</Text>

                        <Text style={styles.header}>Languages:</Text>
                        <Text style={styles.detail}>{movieDetails.spoken_languages.map(lang => lang.name).join(', ')}</Text>

                        <Text style={styles.header}>Genres:</Text>
                        <Text style={styles.detail}>{movieDetails.genres.map(genre => genre.name).join(', ')}</Text>

                        {/* Display overview */}
                        <Text style={styles.header}>Overview:</Text>
                        <Text style={styles.overview}>{movieDetails.overview}</Text>

                        {/* Display production companies */}
                        <Text style={styles.header}>Production Companies:</Text>
                        <View style={styles.companiesContainer}>
                            {movieDetails.production_companies.map((company, index) => (
                                <View key={index} style={styles.company}>
                                    <Text style={styles.companyName}>{company.name}</Text>
                                    {company.logo_path && (
                                        <Image
                                            source={{ uri: `https://image.tmdb.org/t/p/w500${company.logo_path}` }}
                                            style={styles.companyLogo}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                    <BackButton />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for the safe area
    safeArea: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the scroll view container
    scrollView: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the main container
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        margin: 10,
        elevation: 3,
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
    // Style for the movie poster
    poster: {
        width: '100%',
        height: 500,
        borderRadius: 10,
    },
    // Style for the details container
    detailsContainer: {
        width: '100%',
        flex: 1,
        marginTop: 20,
    },
    // Style for the movie title
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        color: '#9b59b6',
    },
    // Style for the section headers
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#8e44ad',
    },
    // Style for the overview text
    overview: {
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'justify',
        color: '#ecf0f1',
    },
    // Style for the detailed text
    detail: {
        fontSize: 16,
        marginVertical: 5,
        color: '#bdc3c7',
    },
    // Style for rows displaying two items
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // Style for the production companies container
    companiesContainer: {
        marginVertical: 10,
    },
    // Style for individual company items
    company: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#8e44ad',
        borderRadius: 5,
        backgroundColor: '#3c3c3c',
    },
    // Style for the company name
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        color: '#ecf0f1',
    },
    // Style for the company logo
    companyLogo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    // Style for the watchlist button
    watchlistButton: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#8e44ad',
        borderRadius: 5,
    },
    // Style for the watchlist button text
    watchlistButtonText: {
        color: '#ecf0f1',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default MovieDetailScreen;
