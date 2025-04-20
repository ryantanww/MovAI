import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from '../screens/SignupScreen';

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

describe('<SignUpScreen />', () => {

    // Test snapshot matching
    it('should match snapshot', async () => {
        const snap = await waitFor(() =>
            render(
                <NavigationContainer>
                    <SignUpScreen />
                </NavigationContainer>
            ).toJSON()
        );

        expect(snap).toMatchSnapshot();
    });

});
