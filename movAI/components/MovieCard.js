import React, { PureComponent } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

class MovieCard extends PureComponent {
    render() {
        // Destructure movie, onPress, and style props
        const { movie, onPress, style } = this.props;

        // Construct the image URL for the movie poster
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        return (
            // TouchableOpacity for handling movie card press
            <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <Text style={styles.title}>{movie.title}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    // Style for the movie card container
    card: {
        marginRight: 10,
        width: 150,
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#9b59b6',
    },
    // Style for the movie poster image
    image: {
        width: '100%',
        height: 225,
    },
    // Style for the title container (optional, not used here)
    titleContainer: {
        bottom: 0,
        width: '100%',
        backgroundColor: '#2c2c2c',
        padding: 10,
    },
    // Style for the movie title text
    title: {
        marginTop: 5,
        textAlign: 'center',
        color: '#ecf0f1',
        fontWeight: 'bold',
    },
});

export default MovieCard;
