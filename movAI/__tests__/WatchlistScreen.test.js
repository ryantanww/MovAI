import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { NavigationContainer } from '@react-navigation/native';
import WatchlistScreen from '../screens/WatchlistScreen';

import mockAsyncStorage from './__mocks__/@react-native-async-storage/async-storage';

// Mock useNavigation hook
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    NavigationContainer: ({ children }) => children,
}));

describe('<WatchlistScreen />', () => {

    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test snapshot matching
    it('should match snapshot', async () => {
        const snap = await waitFor(() =>
            render(
                <NavigationContainer>
                    <WatchlistScreen />
                </NavigationContainer>
            ).toJSON()
        );
        expect(snap).toMatchSnapshot();
    });

    // Test watchlist data fetching and movie list rendering
    it('displays the movie list after successfully fetching watchlist data', async () => {
        mockAsyncStorage.getItem.mockResolvedValueOnce('123');
        mockAsyncStorage.getItem.mockResolvedValueOnce('token123');

        const mockMovies = [{ movie_id: 1, title: 'Movie 1' }, { movie_id: 2, title: 'Movie 2' }];
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockMovies),
            })
        );

        const { getByTestId, getByText } = render(
            <NavigationContainer>
                <WatchlistScreen />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByTestId('movie-list')).toBeTruthy();
            expect(getByText('Movie 1')).toBeTruthy();
            expect(getByText('Movie 2')).toBeTruthy();
        });
    });
});
