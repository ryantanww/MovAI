import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import MovieList from '../components/MovieList';
import { NavigationContainer } from '@react-navigation/native';

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

describe('<MovieList />', () => {
    const movies = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
    ];

    // Test snapshot matching
    it('should match snapshot', () => {
        const snap = render(
            <NavigationContainer>
                <MovieList movies={movies} loading={false} error={null} />
            </NavigationContainer>
        ).toJSON();
        expect(snap).toMatchSnapshot();
    });

    // Test rendering of the movie list
    it('should render the movie list', () => {
        const { getByText } = render(
            <NavigationContainer>
                <MovieList movies={movies} loading={false} error={null} />
            </NavigationContainer>
        );

        expect(getByText('Movie 1')).toBeTruthy();
        expect(getByText('Movie 2')).toBeTruthy();
    });

    // Test navigation to MovieDetail screen on card press
    it('navigates to MovieDetail screen when a movie card is pressed', () => {
        const { getByText } = render(
            <NavigationContainer>
                <MovieList movies={movies} loading={false} error={null} />
            </NavigationContainer>
        );

        fireEvent.press(getByText('Movie 1'));

        expect(mockNavigate).toHaveBeenCalledWith('MovieDetail', { movieId: 1 });
    });

});
