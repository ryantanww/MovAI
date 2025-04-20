import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { getDailyTrendingMovies } from '../tmdbApi';

const TrendingAnimated = () => {
    // Access navigation object
    const navigation = useNavigation();

    // State to store the list of movies
    const [movie, setMovie] = useState(null);

    // State to control the loading indicator
    const [loading, setLoading] = useState(true);

    // State to store any errors
    const [error, setError] = useState(null);

    // Animated value for fade effect
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Fetch trending movie and manage animation
    useEffect(() => {
        const fetchDailyTrendingMovie = async () => {
            try {
                const movies = await getDailyTrendingMovies();
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                setMovie(randomMovie);
            } catch (error) {
                setError('Failed to fetch movies!');
            } finally {
                setLoading(false);
            }
        };

        const fadeIn = () => {
            try {
                Animated.timing(fadeAnim, {
                    toValue: 1, 
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            } catch (error) {
                setError('Error during fade-in animation!');
            }
        };

        const fadeOut = async () => {
            try {
                await Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000, 
                    useNativeDriver: true,
                }).start();

                await fetchDailyTrendingMovie();
                fadeIn();
            } catch (error) {
                setError('Error during fade-out and movie change!');
            }
        };

        fadeOut();

        const interval = setInterval(() => {
            fadeOut();
        }, 30000);

        return () => clearInterval(interval);
    }, [fadeAnim]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9b59b6" />
            </View>
        );
    }

    if (error || !movie) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Handle navigation to movie details screen
    const handlePress = () => {
        try {
            navigation.navigate('MovieDetail', { movieId: movie.id });
        } catch (error) {
            setError('Error navigating to MovieDetail!');
        }
    };

    return (
        <View style={styles.container}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    style={styles.backgroundImage}
                    blurRadius={10}
                />
            </BlurView>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                        style={styles.image}
                    />
                    <Text style={styles.title}>{movie.title}</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    // Container style
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        paddingVertical: 20,
    },
    // Loading container style
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Error message container style
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    // Background image style
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    // Movie poster image style
    image: {
        width: 300,
        height: 450,
        marginBottom: 10,
    },
    // Movie title style
    title: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginHorizontal: 20,
    },
});

export default TrendingAnimated;
