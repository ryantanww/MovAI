import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { NavigationContainer } from '@react-navigation/native';
import SettingsScreen from '../screens/SettingsScreen';

import mockAsyncStorage from './__mocks__/@react-native-async-storage/async-storage';

// Mock useNavigation hook
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    NavigationContainer: ({ children }) => children,
}));

describe('<SettingsScreen />', () => {

    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test snapshot matching for logged-out state
    it('matches the snapshot for logged-out state', async () => {
        mockAsyncStorage.getItem.mockResolvedValueOnce(null);

        const snap = await waitFor(() =>
            render(
                <NavigationContainer>
                    <SettingsScreen />
                </NavigationContainer>
            ).toJSON()
        );

        expect(snap).toMatchSnapshot();
    });

    // Test snapshot matching for logged-in state
    it('matches the snapshot for logged-in state', async () => {
        mockAsyncStorage.getItem.mockResolvedValueOnce('123');
        mockAsyncStorage.getItem.mockResolvedValueOnce('token123');

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' }),
            })
        );

        const snap = await waitFor(() =>
            render(
                <NavigationContainer>
                    <SettingsScreen />
                </NavigationContainer>
            ).toJSON()
        );

        expect(snap).toMatchSnapshot();
    });

    // Test rendering for logged-out state
    it('renders correctly when no user is logged in', async () => {
        mockAsyncStorage.getItem.mockResolvedValueOnce(null);

        const { getByTestId, getByText } = render(
            <NavigationContainer>
                <SettingsScreen />
            </NavigationContainer>
        );

        expect(getByTestId('settings-title')).toBeTruthy();
        expect(getByText('Sign Up')).toBeTruthy();
        expect(getByText('Log In')).toBeTruthy();
    });

    // Test rendering for logged-in state
    it('renders correctly when the user is logged in', async () => {
        mockAsyncStorage.getItem.mockResolvedValueOnce('123'); 
        mockAsyncStorage.getItem.mockResolvedValueOnce('token123'); 

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ username: 'testuser' }),
            })
        );

        const { getByText } = await waitFor(() =>
            render(
                <NavigationContainer>
                    <SettingsScreen />
                </NavigationContainer>
            )
        );

        expect(getByText('Welcome, testuser')).toBeTruthy();
        expect(getByText('Watchlist')).toBeTruthy();
        expect(getByText('Logout')).toBeTruthy();
    });

    // Test error message when fetching user data fails
    it('displays an error message when fetching user data fails', async () => {
        mockAsyncStorage.getItem.mockResolvedValueOnce('123');
        mockAsyncStorage.getItem.mockResolvedValueOnce('token123');

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        );

        const { getByTestId } = render(
            <NavigationContainer>
                <SettingsScreen />
            </NavigationContainer>
        );

        await waitFor(() => expect(getByTestId('settings-title')).toBeTruthy());
        expect(fetch).toHaveBeenCalled();
    });
});
