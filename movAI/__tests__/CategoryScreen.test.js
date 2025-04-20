import React from 'react';
import { render, waitFor, act } from 'react-native-testing-library';
import CategoryScreen from '../screens/CategoryScreen';
import { NavigationContainer } from '@react-navigation/native';
import { getGenreMovies } from '../tmdbApi';

// Mock tmdbApi
jest.mock('../tmdbApi');

// Mock useNavigation and useRoute hooks
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(), 
            goBack: jest.fn(),
        }),
        useRoute: () => ({
            params: { genreId: 1, genreName: 'Drama' },
        }),
    };
});

describe('<CategoryScreen />', () => {
    const route = { params: { genreId: 1, genreName: 'Drama' } };

    // Clear mocks and set up mock API response before each test
    beforeEach(() => {
        jest.clearAllMocks();
        getGenreMovies.mockResolvedValue({
            movies: [
                { id: 1, poster_path: '/testPoster1.jpg', title: 'Test Movie 1' },
                { id: 2, poster_path: '/testPoster2.jpg', title: 'Test Movie 2' },
            ],
            totalPages: 2,
        });
    });

    // Clear mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test snapshot matching
    it('should match snapshot', async () => {
        const snap = await waitFor(() =>
            render(
                <NavigationContainer>
                    <CategoryScreen route={route} />
                </NavigationContainer>
            ).toJSON()
        );
        expect(snap).toMatchSnapshot();
    });

    // Test genre name and movies rendering
    it('renders the genre name and movies', async () => {
        const { getByText } = render(
            <NavigationContainer>
                <CategoryScreen route={route} />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByText('Drama Movies')).toBeTruthy();
            expect(getByText('Test Movie 1')).toBeTruthy();
            expect(getByText('Test Movie 2')).toBeTruthy();
        });
    });

    // Test error message when API call fails
    it('displays an error message when the API call fails', async () => {
        getGenreMovies.mockRejectedValueOnce(new Error('Failed to fetch movies'));

        const { getByText } = render(
            <NavigationContainer>
                <CategoryScreen route={route} />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByText('Failed to fetch movies')).toBeTruthy();
        });
    });

    // Test getGenreMovies call when scrolling down
    it('calls getGenreMovies when scrolling down', async () => {
        const { getByTestId, getByText } = render(
            <NavigationContainer>
                <CategoryScreen route={route} />
            </NavigationContainer>
        );
    
        await waitFor(() => {
            expect(getByText('Test Movie 1')).toBeTruthy();
        });

        const movieList = getByTestId('movie-list'); 
    
        getGenreMovies.mockResolvedValueOnce({
            movies: [
                { id: 3, poster_path: '/testPoster3.jpg', title: 'Test Movie 3' },
            ],
            totalPages: 2,
        });
            
        await act(async () => {
            movieList.props.onEndReached();
        });

        await waitFor(() => expect(getGenreMovies).toHaveBeenCalledTimes(2));
    });
});
