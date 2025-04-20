import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import GenreCard from '../components/GenreCard';
import { NavigationContainer } from '@react-navigation/native';
import { getRandomGenreMovies } from '../tmdbApi';

// Mock tmdbApi
jest.mock('../tmdbApi');

// Mock useNavigation hook
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockNavigate,
        }),
    };
});

describe('<GenreCard />', () => {

    // Mock API response before each test
    beforeEach(() => {
        getRandomGenreMovies.mockResolvedValue([
            { id: 1, poster_path: '/testPosterPath1.jpg' },
            { id: 2, poster_path: '/testPosterPath2.jpg' },
        ]);
    });

    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(
            <NavigationContainer>
                <GenreCard genreId={1} genreName="Test Genre" />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });

    // Test navigation to CategoryScreen on press
    it('navigates to the CategoryScreen when pressed', () => {
        const { getByText } = render(
            <NavigationContainer>
                <GenreCard genreId={1} genreName="Test Genre" />
            </NavigationContainer>
        );

        fireEvent.press(getByText('Test Genre'));

        expect(mockNavigate).toHaveBeenCalledWith('CategoryScreen', { genreId: 1, genreName: 'Test Genre' });
    });
});
