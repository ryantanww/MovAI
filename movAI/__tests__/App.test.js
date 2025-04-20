import React from 'react';
import { render } from 'react-native-testing-library';

import App from '../App';

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
    return {
        GestureHandlerRootView: ({ children }) => children,
        PanGestureHandler: ({ children }) => children,
        State: {},
        Directions: {},
    };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {}; // Mock call method
    return Reanimated;
});

// Mock Native Animated Helper to prevent errors
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('<App />', () => {

    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(<App />).toJSON();
        expect(snap).toMatchSnapshot();
    });
});
