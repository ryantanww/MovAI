import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import BackButton from '../components/BackButton'
import { NavigationContainer } from '@react-navigation/native';

// Mock useNavigation hook
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            goBack: mockGoBack,
        }),
    };
});

describe('<BackButton />', () => {

    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(
            <NavigationContainer>
                <BackButton />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });

    // Test goBack function on button press
    it('calls goBack when pressed', () => {
        const { getByText } = render(
            <NavigationContainer>
                <BackButton />
            </NavigationContainer>
        );

        const backButton = getByText('Back');
        fireEvent.press(backButton);

        expect(mockGoBack).toHaveBeenCalled();
    });
});
