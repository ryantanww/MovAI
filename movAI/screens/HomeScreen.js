import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as tmdbApi from '../tmdbApi';
import Header from '../components/Header';
import CardContainer from '../components/CardContainer';
import TrendingAnimated from '../components/TrendingAnimated';

const HomeScreen = () => {
    // Access the navigation object
    const navigation = useNavigation();

    // State for trending weekly movies
    const [trendingWeekly, setTrendingWeekly] = useState([]);
    
    // State for popular movies
    const [popularMovies, setPopularMovies] = useState([]);
    
    // State for top-rated movies
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    
    // State for movies from random genres
    const [randomGenreMovies, setRandomGenreMovies] = useState([]);
    
    // State for names of the random genres selected
    const [randomGenreNames, setRandomGenreNames] = useState([]);
    
    // State for search query input
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for loading status (true when fetching data)
    const [loading, setLoading] = useState(true);
    
    // State for error messages if fetching data fails
    const [error, setError] = useState(null);

    // Fetch movie data on component mount
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Fetch trending, popular, and top-rated movies, along with random genres
                const trendingWeeklyData = await tmdbApi.getWeeklyTrendingMovies();
                setTrendingWeekly(trendingWeeklyData);

                const popularMoviesData = await tmdbApi.getPopularMovies();
                setPopularMovies(popularMoviesData);

                const topRatedMoviesData = await tmdbApi.getTopRatedMovies();
                setTopRatedMovies(topRatedMoviesData);

                const genres = await tmdbApi.getGenres();
                if (genres.length > 0) {
                    const selectedGenres = [];
                    const selectedGenreNames = [];
                    // Randomly select 3 genres
                    while (selectedGenres.length < 3) {
                        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
                        if (!selectedGenres.includes(randomGenre.id)) {
                            selectedGenres.push(randomGenre.id);
                            selectedGenreNames.push(randomGenre.name);
                        }
                    }

                    // Fetch random movies for each genre
                    const randomGenreMoviesData = await Promise.all(
                        selectedGenres.map(genreId => tmdbApi.getRandomGenreMovies(genreId))
                    );
                    setRandomGenreMovies(randomGenreMoviesData);
                    setRandomGenreNames(selectedGenreNames);
                }
            } catch (error) {
                // Set error if fetching fails
                setError('Failed to fetch movies!');
            } finally {
                // Set loading to false once the data is fetched
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Handle search submission
    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigation.navigate('SearchResults', { query: searchQuery.trim() });
            setSearchQuery(''); // Clear the search input
        }
    };

    // Display loading indicator while fetching data
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9b59b6" />
            </View>
        );
    }

    // Display error message if fetching fails
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
            {/* Render the search bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for movies..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearchSubmit}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Render movie lists */}
            <ScrollView style={styles.scrollView}>
                <TrendingAnimated navigation={navigation} />
                <View style={styles.container}>
                    <CardContainer title="Trending" data={trendingWeekly} navigation={navigation} />
                    <CardContainer title="Popular" data={popularMovies} navigation={navigation} />
                    <CardContainer title="Top Rated" data={topRatedMovies} navigation={navigation} />

                    {/* Render movies by random genres */}
                    {randomGenreMovies.map((movies, index) => (
                        <CardContainer
                            key={index}
                            title={`${randomGenreNames[index]}`}
                            data={movies}
                            navigation={navigation}
                        />
                    ))}
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
    // Style for the scroll view
    scrollView: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the container
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#1e1e1e',
    },
    // Style for the search container
    searchContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#1e1e1e',
        alignItems: 'center',
    },
    // Style for the search input
    searchInput: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginRight: 10,
    },
    // Style for the search button
    searchButton: {
        marginLeft: 10,
        backgroundColor: '#9b59b6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    // Style for the search button text
    searchButtonText: {
        color: '#ecf0f1',
        fontSize: 16,
    },
    // Style for the loading container
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
    },
    // Style for the loading text (optional)
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
});

export default HomeScreen;
