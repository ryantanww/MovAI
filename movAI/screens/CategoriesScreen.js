import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGenres } from '../tmdbApi';
import Header from '../components/Header';
import GenreCard from '../components/GenreCard';

const CategoriesScreen = () => {
    // State to store the list of movie genres
    const [genres, setGenres] = useState([]);

    // State to manage the loading status
    const [loading, setLoading] = useState(true);

    // State to store any errors while fetching genres
    const [error, setError] = useState(null);

    // useEffect to fetch genres when the component mounts
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                // Fetch genres from the API and update the state
                const genresData = await getGenres();
                setGenres(genresData);
            } catch (error) {
                // Set error message if fetching genres fails
                console.error('Error fetching genres:', error.message);
                setError('Failed to fetch genres!');
            } finally {
                // Stop the loading state after fetching is done
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    // Render error message if there is an error
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Render loading message if data is still being fetched
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Render the header component */}
            <Header />

            <View style={styles.container}>
                {/* Render the list of genres in a FlatList */}
                <FlatList
                    data={genres}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <GenreCard genreId={item.id} genreName={item.name} />
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for the safe area
    safeArea: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the main container
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1e1e1e',
    },
    // Style for the loading container
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Style for the loading text
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#bdc3c7',
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
    // Style for each row in the FlatList
    row: {
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default CategoriesScreen;
