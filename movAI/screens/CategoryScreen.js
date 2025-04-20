import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGenreMovies } from '../tmdbApi';
import Header from '../components/Header';
import MovieList from '../components/MovieList';
import BackButton from '../components/BackButton';

const CategoryScreen = () => {

    // Access the route object to get the genreId and genreName passed from navigation
    const route = useRoute();
    const { genreId, genreName } = route.params;

    // State to store movies in the selected genre
    const [movies, setMovies] = useState([]);

    // State to manage the current page for pagination
    const [page, setPage] = useState(1);

    // State to store the total number of pages for the genre movies
    const [totalPages, setTotalPages] = useState(1);

    // State to manage loading status when fetching movies
    const [loading, setLoading] = useState(true);

    // State to manage loading status when fetching more movies (pagination)
    const [loadingMore, setLoadingMore] = useState(false);

    // State to store any error messages during API calls
    const [error, setError] = useState(null);

    // Set the maximum number of pages to fetch (TMDB API limit)
    const maxPages = 500;

    // Fetch movies based on the selected genre and page when the component mounts or page updates
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Fetch genre movies and set movies and totalPages
                const { movies: newMovies, totalPages } = await getGenreMovies(genreId, page);
                setMovies(prevMovies => [...prevMovies, ...newMovies]);
                setTotalPages(Math.min(totalPages, maxPages));
            } catch (error) {
                setError('Failed to fetch movies');
            } finally {
                setLoading(false);
                setLoadingMore(false); 
            }
        };

        fetchMovies();

    }, [page, genreId]); 

    // Function to handle loading more movies when the user scrolls to the end
    const handleLoadMore = () => {
        if (!loadingMore && page < totalPages && page < maxPages) {
            setLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Render the header component */}
            <Header />

            <View style={styles.container}>
                {/* Display the genre name as the screen title */}
                <Text style={styles.genreName}>{genreName} Movies</Text>

                {/* Render the MovieList component with the fetched movies */}
                <MovieList
                    testID="movie-list"
                    movies={movies}
                    loading={loading}
                    error={error}
                    onLoadMore={handleLoadMore}
                    loadingMore={loadingMore}
                    idKey="id"
                />

                {/* Render the back button component */}
                <BackButton />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for the safe area view
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
    // Style for the genre name title
    genreName: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9b59b6',
        marginBottom: 10,
    },
});

export default CategoryScreen;
