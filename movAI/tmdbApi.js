import axios from 'axios';
import { TMDB_API_KEY } from '@env';

// Store the TMDB API key and base URL for API requests
const apiKey = TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

// Create an Axios instance for making API requests
const api = axios.create({
    baseURL: baseUrl,
});

// Function to get popular movies with random page selection
export const getPopularMovies = async () => {
    try {
        // Fetch the total number of pages
        const pageResponse = await api.get('/movie/popular', {
            params: {
                api_key: apiKey,
            },
        });
        let totalPages = pageResponse.data.total_pages;

        // Limit the pages to a maximum of 500
        if (totalPages > 500) {
            totalPages = 500;
        }

        // Randomly select a page
        randomPage = Math.floor(Math.random() * totalPages) + 1;

        // Fetch popular movies from the selected random page
        const response = await api.get('/movie/popular', {
            params: {
                api_key: apiKey,
                page: randomPage,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch popular movies:', error);
        throw error;
    }
};

// Function to get top-rated movies with random page selection
export const getTopRatedMovies = async () => {
    try {
        // Fetch the total number of pages
        const pageResponse = await api.get('/movie/top_rated', {
            params: {
                api_key: apiKey,
            },
        });
        let totalPages = pageResponse.data.total_pages;

        // Limit the pages to a maximum of 500
        if (totalPages > 500) {
            totalPages = 500;
        }

        // Randomly select a page
        randomPage = Math.floor(Math.random() * totalPages) + 1;

        // Fetch top-rated movies from the selected random page
        const response = await api.get('/movie/top_rated', {
            params: {
                api_key: apiKey,
                page: randomPage,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch top-rated movies:', error);
        throw error;
    }
};

// Function to get all genres
export const getGenres = async () => {
    try {
        // Fetch all movie genres from TMDB
        const response = await api.get('/genre/movie/list', {
            params: {
                api_key: apiKey,
            },
        });
        return response.data.genres;
    } catch (error) {
        console.error('Failed to fetch genres:', error);
        throw error;
    }
};

// Function to get random movies for a specific genre
export const getRandomGenreMovies = async (genreId) => {
    try {
        // Fetch the total number of pages for the genre
        const pageResponse = await api.get('/discover/movie', {
            params: {
                api_key: apiKey,
                with_genres: genreId,
            },
        });
        let totalPages = pageResponse.data.total_pages;

        // Limit the pages to a maximum of 500
        if (totalPages > 500) {
            totalPages = 500;
        }

        // Randomly select a page for the genre
        randomPage = Math.floor(Math.random() * totalPages) + 1;

        // Fetch movies from the selected random page for the genre
        const response = await api.get('/discover/movie', {
            params: {
                api_key: apiKey,
                page: randomPage,
                with_genres: genreId,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error(`Failed to fetch movies for genre ${genreId}:`, error);
        throw error;
    }
};

// Function to get movies for a specific genre and page
export const getGenreMovies = async (genreId, page = 1) => {
    try {
        // Fetch movies for the specified genre and page
        const response = await api.get('/discover/movie', {
            params: {
                api_key: apiKey,
                with_genres: genreId,
                page: page,
            },
        });
        return {
            movies: response.data.results,
            totalPages: response.data.total_pages,
        };
    } catch (error) {
        console.error(`Failed to fetch movies for genre ${genreId}:`, error);
        throw error;
    }
};

// Function to get daily trending movies with random page selection
export const getDailyTrendingMovies = async () => {
    try {
        // Fetch the total number of pages for daily trending movies
        const pageResponse = await api.get('/trending/movie/day', {
            params: {
                api_key: apiKey,
            },
        });
        let totalPages = pageResponse.data.total_pages;

        // Limit the pages to a maximum of 500
        if (totalPages > 500) {
            totalPages = 500;
        }

        // Randomly select a page for daily trending movies
        randomPage = Math.floor(Math.random() * totalPages) + 1;

        // Fetch daily trending movies from the selected random page
        const response = await api.get('/trending/movie/day', {
            params: {
                api_key: apiKey,
                page: randomPage,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch daily trending movies:', error);
        throw error;
    }
};

// Function to get weekly trending movies with random page selection
export const getWeeklyTrendingMovies = async () => {
    try {
        // Fetch the total number of pages for weekly trending movies
        const pageResponse = await api.get('/trending/movie/week', {
            params: {
                api_key: apiKey,
            },
        });
        let totalPages = pageResponse.data.total_pages;

        // Limit the pages to a maximum of 500
        if (totalPages > 500) {
            totalPages = 500;
        }

        // Randomly select a page for weekly trending movies
        randomPage = Math.floor(Math.random() * totalPages) + 1;

        // Fetch weekly trending movies from the selected random page
        const response = await api.get('/trending/movie/week', {
            params: {
                api_key: apiKey,
                page: randomPage,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch weekly trending movies:', error);
        throw error;
    }
};

// Function to get detailed information for a specific movie
export const getMovieDetails = async (movieId) => {
    try {
        // Fetch details for the specified movie
        const response = await api.get(`/movie/${movieId}`, {
            params: {
                api_key: apiKey,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch movie details for movie ${movieId}:`, error);
        throw error;
    }
};

// Function to search for movies based on a query
export const searchMovies = async (query) => {
    try {
        // Search for movies based on the query
        const response = await api.get('/search/movie', {
            params: {
                api_key: apiKey,
                query,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error(`Failed to search movies with query "${query}":`, error);
        throw error;
    }
};
