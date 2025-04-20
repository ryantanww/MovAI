import React from 'react';
import { render, waitFor } from 'react-native-testing-library';
import ChatbotScreen from '../screens/ChatbotScreen';

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

describe('<ChatbotScreen />', () => {

    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test snapshot matching
    it('should match the snapshot', async () => {
        const snap = await waitFor(() =>
            render(<ChatbotScreen />).toJSON()
        );
        expect(snap).toMatchSnapshot();
    });
});
