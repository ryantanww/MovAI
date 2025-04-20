import React from 'react';
import { render } from 'react-native-testing-library';
import MovieCard from '../components/MovieCard';

describe('<MovieCard />', () => {

    // Test snapshot matching
    it('should match snapshot', () => {
        const mockMovie = {
            id: 1,
            title: 'Test',
            poster_path: '/testPosterPath.jpg',
        };
        const snap = render(<MovieCard movie={mockMovie} onPress={() => {}} />).toJSON();
        expect(snap).toMatchSnapshot();
    });
});
