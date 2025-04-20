import axios from 'axios';
import { WIT_API_KEY } from '@env';

// Store the Wit.ai API key and base URL for API requests
const apiKey = WIT_API_KEY;
const baseUrl = 'https://api.wit.ai/message';

// Function to send a message to Wit.ai and get a response
export const sendMessage = async (message) => {
    try {
        // Send GET request to Wit.ai with message as a query parameter
        const response = await axios.get(baseUrl, {
            params: {
                q: message,
            },
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        // Return the response data from Wit.ai
        return response.data;
    } catch (error) {
        console.error('Error communicating with Wit.ai:', error);
        return null;
    }
};

// Function to generate random predefined suggestions for the chatbot
export const getSuggestions = async () => {
    // Array of predefined suggestions
    const predefinedSuggestions = [
        "Show me popular movies",
        "What are the top-rated movies?",
        "Find me some action movies.",
        "What are the trending movies today?",
        "Recommend me a comedy movie.",
        "I want to watch a horror film.",
        "Suggest a drama movie.",
        "Show me some sci-fi movies.",
        "What's trending this week?",
        "Find me a romantic movie."
    ];

    // Empty array to store random suggestions
    const suggestions = [];

    // Loop to generate 5 unique random suggestions
    while (suggestions.length < 5) {
        // Pick a random index from the predefined suggestions array
        const randomIndex = Math.floor(Math.random() * predefinedSuggestions.length);
        const suggestion = predefinedSuggestions[randomIndex];

        // Check if the suggestion is already included, if not, add it
        if (!suggestions.includes(suggestion)) {
            suggestions.push(suggestion);
        }
    }

    // Return the array of 5 random suggestions
    return suggestions;
}
