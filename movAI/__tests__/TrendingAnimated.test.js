import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { NavigationContainer } from '@react-navigation/native';
import TrendingAnimated from '../components/TrendingAnimated';
import { getDailyTrendingMovies } from '../tmdbApi';

// Mock the API function
jest.mock('../tmdbApi');

describe('<TrendingAnimated />', () => {

    // Test snapshot matching
    it('should match snapshot', async () => {
        const snap = await waitFor(() =>
            render(
                <NavigationContainer>
                    <TrendingAnimated />
                </NavigationContainer>
            ).toJSON()
        );
        expect(snap).toMatchSnapshot();
    });

    // Test error message display when API call fails
    it('displays an error message when the API call fails', async () => {
        getDailyTrendingMovies.mockRejectedValueOnce(new Error('Failed to fetch movies!'));

        const { getByText } = render(
            <NavigationContainer>
                <TrendingAnimated />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByText('Failed to fetch movies!')).toBeTruthy();
        });
    });
});
