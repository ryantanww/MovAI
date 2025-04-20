import React from 'react';
import { render, waitFor, fireEvent } from 'react-native-testing-library';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { getPopularMovies, getTopRatedMovies, getRandomGenreMovies, getGenres } from '../tmdbApi';

// Mock tmdbApi
jest.mock('../tmdbApi');

describe('<HomeScreen />', () => {

    // Mock API responses before each test
    beforeEach(() => {
        getPopularMovies.mockResolvedValue([
            { id: 1, poster_path: '/testPopularPoster1.jpg', title: 'Test Popular Movie 1' },
            { id: 2, poster_path: '/testPopularPoster2.jpg', title: 'Test Popular Movie 2' },
        ]);
    
        getTopRatedMovies.mockResolvedValue([
            { id: 1, poster_path: '/testTopRatedPoster1.jpg', title: 'Test Top Rated Movie 1' },
            { id: 2, poster_path: '/testTopRatedPoster2.jpg', title: 'Test Top Rated Movie 2' },
        ]);
    
        getGenres.mockResolvedValue([
            { id: 1, name: 'Genre 1' },
            { id: 2, name: 'Genre 2' },
            { id: 3, name: 'Genre 3' },
        ]);
    
        getRandomGenreMovies.mockResolvedValue([
            { id: 1, poster_path: '/testRandomGenrePoster1.jpg', title: 'Test Random Genre Movie 1' },
            { id: 2, poster_path: '/testRandomGenrePoster2.jpg', title: 'Test Random Genre Movie 2' },
        ]);
    });
    
    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test snapshot matching
    it('should match snapshot', async () => {
        const snap = await waitFor(() =>
            render(
                <NavigationContainer>
                    <HomeScreen />
                </NavigationContainer>
            ).toJSON()
        );
        expect(snap).toMatchSnapshot();
    });

    // Test header and sections rendering
    it('renders the header and sections', async () => {
        const { getByText } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );
    
        await waitFor(() => {
            expect(getByText('Popular')).toBeTruthy();
            expect(getByText('Top Rated')).toBeTruthy();
            expect(getByText('Genre 1')).toBeTruthy();
            expect(getByText('Genre 2')).toBeTruthy();
            expect(getByText('Genre 3')).toBeTruthy();
        });
    });

    // Test error message display when API calls fail
    it('displays an error message when the API calls fail', async () => {
        getPopularMovies.mockRejectedValueOnce(new Error('Failed to fetch movies!'));
        getTopRatedMovies.mockRejectedValueOnce(new Error('Failed to fetch movies!'));
        getGenres.mockRejectedValueOnce(new Error('Failed to fetch movies!'));
        getRandomGenreMovies.mockRejectedValueOnce(new Error('Failed to fetch movies!'));
    
        const { getByText } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );
    
        await waitFor(() => {
            expect(getByText('Failed to fetch movies!')).toBeTruthy();
        });
    });
});
