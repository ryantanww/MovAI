import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { getMovieDetails } from '../tmdbApi';

// Mock tmdbApi
jest.mock('../tmdbApi');

// Mock useNavigation and useRoute hooks
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            goBack: jest.fn(), 
        }),
        useRoute: () => ({
            params: { movieId: 1 }, 
        }),
    };
});

describe('<MovieDetailScreen />', () => {

    // Mock API response before each test
    beforeEach(() => {
        getMovieDetails.mockResolvedValue({
            id: 1,
            poster_path: '/testPosterPath.jpg',
            title: 'Test Movie',
            vote_average: 8.5,
            vote_count: 1234,
            release_date: '2021-01-01',
            spoken_languages: [{ name: 'English' }],
            genres: [{ name: 'Drama' }],
            overview: 'This is a test movie overview.',
            production_companies: [
                { name: 'Test Company', logo_path: '/testLogoPath.jpg' }
            ],
        });
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
                    <MovieDetailScreen route={{ params: { movieId: 1 } }} />
                </NavigationContainer>
            ).toJSON()
        );
        expect(snap).toMatchSnapshot();
    });

    // Test movie details rendering
    it('displays movie details correctly', async () => {
        const { getByText } = render(
            <NavigationContainer>
                <MovieDetailScreen />
            </NavigationContainer>
        );
    
        await waitFor(() => {
            expect(getByText('Test Movie')).toBeTruthy();
            expect(getByText('Rating:')).toBeTruthy();
            expect(getByText('Vote Count:')).toBeTruthy();
            expect(getByText('Release Date:')).toBeTruthy();
            expect(getByText('Languages:')).toBeTruthy();
            expect(getByText('Genres:')).toBeTruthy();
            expect(getByText('Overview:')).toBeTruthy();
            expect(getByText('Production Companies:')).toBeTruthy();
        });
    });

    // Test error message display when API call fails
    it('displays an error message when the API call fails', async () => {
        getMovieDetails.mockRejectedValueOnce(new Error('Failed to fetch movie details!'));
    
        const { getByText } = render(
            <NavigationContainer>
                <MovieDetailScreen route={{ params: { movieId: 1 } }} />
            </NavigationContainer>
        );
    
        await waitFor(() => {
            expect(getByText('Failed to fetch movie details!')).toBeTruthy();
        });
    });
});
