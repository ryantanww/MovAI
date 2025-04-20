import React from 'react';
import { render } from 'react-native-testing-library';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { searchMovies } from '../tmdbApi';

// Mock navigation and route hooks
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
        useRoute: jest.fn(),
    };
});

// Mock tmdbApi
jest.mock('../tmdbApi', () => ({
    searchMovies: jest.fn(),
}));

describe('<SearchResultsScreen />', () => {

    // Set up mock route and API response before each test
    beforeEach(() => {
        useRoute.mockReturnValue({
            params: { query: 'Test Query' },
        });

        searchMovies.mockResolvedValue([
            { id: 1, title: 'Movie 1', poster_path: '/path1.jpg' },
            { id: 2, title: 'Movie 2', poster_path: '/path2.jpg' },
        ]);
    });

    // Test snapshot matching
    it('should match snapshot', async () => {
        const snap = render(
            <NavigationContainer>
                <SearchResultsScreen />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });
});
