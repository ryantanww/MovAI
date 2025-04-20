import React from 'react';
import { render } from 'react-native-testing-library';
import FAQScreen from '../screens/FAQScreen';
import { NavigationContainer } from '@react-navigation/native';

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

describe('<FAQScreen />', () => {

    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(
            <NavigationContainer>
                <FAQScreen />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });
});
