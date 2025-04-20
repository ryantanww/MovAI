import React from 'react';
import { render } from 'react-native-testing-library';
import BottomTab from '../components/BottomTab';
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

describe('<BottomTab />', () => {

    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(
            <NavigationContainer>
                <BottomTab />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });
});
