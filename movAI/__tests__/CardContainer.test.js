import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import CardContainer from '../components/CardContainer';
import { NavigationContainer } from '@react-navigation/native';

// Mock tmdbApi
jest.mock('../tmdbApi');

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

describe('<CardContainer />', () => {
    const testData = [
        { id: 1, poster_path: '/testPosterPath1.jpg', title: 'Test Movie 1' },
        { id: 2, poster_path: '/testPosterPath2.jpg', title: 'Test Movie 2' },
    ];
    
    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(
            <NavigationContainer>
                <CardContainer
                    title="Test Title"
                    data={testData}
                />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });

    // Test navigation to movie detail on card press
    it('navigates to movie detail screen on card press', () => {
        const { getByText } = render(
            <NavigationContainer>
                <CardContainer
                    title="Test Title"
                    data={testData}
                />
            </NavigationContainer>
        );
    
        fireEvent.press(getByText('Test Movie 1'));

        expect(mockNavigate).toHaveBeenCalledWith('MovieDetail', { movieId: 1 });
    });
});
