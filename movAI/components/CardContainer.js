import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MovieCard from './MovieCard';

const CardContainer = ({ title, data }) => {
    // Access navigation object
    const navigation = useNavigation();

    return (
        <View style={styles.section}>
            {/* Section title */}
            <Text style={styles.sectionTitle}>{title}</Text>

            {/* Horizontal list of movie cards */}
            <View style={styles.cardsContainer}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    renderItem={({ item }) => (
                        <MovieCard
                            movie={item}
                            onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
                            style={styles.movieCard}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Style for the section container
    section: {
        marginTop: 20,
    },
    // Style for the section title
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#8e44ad',
    },
    // Style for the FlatList container
    listContainer: {
        paddingHorizontal: 5,
    },
    // Style for the movie cards container
    cardsContainer: {
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#9b59b6',
        padding: 10,
    },
    // Style for individual movie cards
    movieCard: {
        borderWidth: 2,
        borderColor: '#8e44ad',
    },
});

export default CardContainer;
