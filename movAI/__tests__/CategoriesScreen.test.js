import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import CategoriesScreen from '../screens/CategoriesScreen';
import { NavigationContainer } from '@react-navigation/native';
import { getGenres } from '../tmdbApi';

// Mock tmdbApi
jest.mock('../tmdbApi');

// Mock useNavigation hook
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
        }),
    };
});

describe('<CategoriesScreen />', () => {

    // Mock API call response
    beforeEach(() => {
        getGenres.mockResolvedValue([
            { id: 1, name: 'Genre 1' },
            { id: 2, name: 'Genre 2' },
            { id: 3, name: 'Genre 3' },
        ]);
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
                    <CategoriesScreen />
                </NavigationContainer>
            ).toJSON()
        );
        expect(snap).toMatchSnapshot();
    });

    // Test rendering of genres
    it('renders the header and genres', async () => {
        const { getByText } = render(
            <NavigationContainer>
                <CategoriesScreen />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByText('Genre 1')).toBeTruthy();
            expect(getByText('Genre 2')).toBeTruthy();
            expect(getByText('Genre 3')).toBeTruthy();
        });
    });

    // Test error message display when API call fails
    it('displays an error message when the API call fails', async () => {
        getGenres.mockRejectedValueOnce(new Error('Failed to fetch genres!'));

        const { getByText } = render(
            <NavigationContainer>
                <CategoriesScreen />
            </NavigationContainer>
        );

        await waitFor(() => {
            expect(getByText('Failed to fetch genres!')).toBeTruthy();
        });
    });
});
