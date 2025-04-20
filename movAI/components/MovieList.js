import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MovieCard from './MovieCard';

const MovieList = ({ movies, loading, error, onLoadMore, loadingMore, idKey = 'id' }) => {
    // Access navigation object
    const navigation = useNavigation();
    
    // Render individual movie card
    const renderMovieCard = ({ item }) => (
        <MovieCard
            movie={item}
            onPress={() => navigation.navigate('MovieDetail', { movieId: item[idKey] })}
            style={styles.movieCard}
        />
    );

    // Extract unique key for each movie item
    const keyExtractor = (item) => item[idKey].toString();

    // Display loading spinner while movies are loading
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9b59b6" />
            </View>
        );
    }

    // Display error message if there is an error
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const numColumns = 2;

    // Render loading indicator at the bottom when more movies are loading
    const renderFooter = () => {
        if (loadingMore) {
            return (
                <View style={styles.loadingMovieContainer}>
                    <ActivityIndicator size="medium" color="#9b59b6" />
                </View>
            );
        }
        return null;
    };

    return (
        <FlatList
            testID="movie-list" 
            data={movies}
            keyExtractor={keyExtractor}
            renderItem={renderMovieCard}
            numColumns={numColumns}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onEndReached={onLoadMore} 
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            initialNumToRender={10}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No movies found.</Text>
                </View>
            )}
            ListFooterComponentStyle={styles.footer}
        />
    );
};

const styles = StyleSheet.create({
    // Style for loading container
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Style for error message container
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
    // Style for rows in FlatList
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    // Style for movie card
    movieCard: {
        flex: 1,
        marginHorizontal: 5,
    },
    // Style for content container of the list
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    // Style for loading indicator when loading more movies
    loadingMovieContainer: {
        paddingVertical: 20,
    },
    // Style for empty list message
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#bdc3c7',
        fontSize: 18,
    },
    // Style for the list footer
    footer: {
        paddingBottom: 20,
    },
});

export default MovieList;
