import React from 'react';
import { render } from 'react-native-testing-library';
import { NavigationContainer } from '@react-navigation/native';
import AboutScreen from '../screens/AboutScreen';

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

describe('<AboutScreen />', () => {

    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(
            <NavigationContainer>
                <AboutScreen />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });

    // Test about screen rendering
    it('renders the about screen correctly', () => {
        const { getByText } = render(<AboutScreen />);

        expect(getByText('About MovAI')).toBeTruthy();
        expect(getByText(/Welcome to movAI, your personal movie exploration/i)).toBeTruthy();
        expect(getByText(/Our application is designed to provide an immersive experience/i)).toBeTruthy();
        expect(getByText(/All movie data in movAI is sourced from The Movie Database/i)).toBeTruthy();
    });

});
