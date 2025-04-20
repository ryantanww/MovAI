import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getRandomGenreMovies } from '../tmdbApi';

const GenreCard = ({ genreId, genreName }) => {
    // Access navigation object
    const navigation = useNavigation();
    
    // State to hold image URL
    const [imageUrl, setImageUrl] = useState(null);

    // Animated value for fade effect
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Fetch random movie image for the genre
    const fetchRandomImage = async () => {
        try {
            const movies = await getRandomGenreMovies(genreId);
            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                setImageUrl(`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`);
                animateImage();
            } else {
                setImageUrl(null);
            }
        } catch (error) {
            console.error(`Failed to fetch random movie image for genre ${genreId}:`, error);
            setImageUrl(null);
        }
    };

    // Handle image fade-in animation
    const animateImage = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    // Fetch random image every 30 seconds
    useEffect(() => {
        fetchRandomImage();
        const interval = setInterval(() => {
            fetchRandomImage();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CategoryScreen', { genreId, genreName })}
        >
            {/* Display movie image or placeholder if no image is available */}
            {imageUrl ? (
                <Animated.Image
                    source={{ uri: imageUrl }}
                    style={[styles.image, { opacity: fadeAnim }]}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            {/* Display genre name */}
            <Text style={styles.title}>{genreName}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Style for the genre card
    card: {
        marginRight: 10,
        width: 150,
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#9b59b6',
    },
    // Style for the movie image
    image: {
        width: '100%',
        height: 225,
    },
    // Style for placeholder when no image is available
    placeholder: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c2c2c',
    },
    // Style for placeholder text
    placeholderText: {
        color: '#ecf0f1',
        fontSize: 16,
    },
    // Style for genre title
    title: {
        marginTop: 5,
        textAlign: 'center',
        color: '#ecf0f1',
        fontWeight: 'bold',
        fontSize: 24,
    },
});

export default GenreCard;
