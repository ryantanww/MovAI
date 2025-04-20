import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendMessage, getSuggestions } from '../WitAI';
import * as tmdbApi from '../tmdbApi';
import Header from '../components/Header';

// ChatbotScreen component for handling movie-related chat functionality
const ChatbotScreen = () => {
    // Access the navigation object
    const navigation = useNavigation();

    // State to store chat messages
    const [messages, setMessages] = useState([]);

    // State to store suggested questions for the chatbot
    const [suggestions, setSuggestions] = useState([]);

    // State to store input text from the user
    const [inputText, setInputText] = useState("");

    // Fetch initial suggestions from Wit.AI upon mounting the component
    useEffect(() => {
        const fetchSuggestions = async () => {
            const suggestions = await getSuggestions();
            setSuggestions(suggestions);
        };

        fetchSuggestions();
    }, []);

    // Function to handle sending messages and processing the chatbot's response
    const onSend = useCallback(async (input = inputText) => {
        const textToSend = input.trim();
        if (textToSend === "") return;

        // Prepare the new message object for display
        const newMessage = {
            _id: Math.random().toString(36).substring(7),
            text: textToSend,
            createdAt: new Date(),
            user: {
                _id: 1,
            },
        };

        // Add the new message to the current chat
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
        setInputText(""); // Clear the input field

        try {
            // Send the message to Wit.AI and get the response
            const response = await sendMessage(textToSend);
            console.log('Wit.ai Response:', response);

            // Process the chatbot's response and generate appropriate replies
            if (response) {
                const botResponses = await generateResponse(response);

                if (Array.isArray(botResponses)) {
                    // Prepare bot response messages and append them to the chat
                    const newMessages = botResponses.map(botResponseText => ({
                        _id: Math.random().toString(36).substring(7),
                        text: botResponseText.text,
                        movieId: botResponseText.movieId,
                        createdAt: new Date(),
                        user: {
                            _id: 2,
                            name: 'Bot',
                        },
                    }));
                    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
                } else {
                    console.error("Unexpected bot response format:", botResponses);
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }, [inputText]);

    // Function to generate chatbot responses based on the user's intent
    const generateResponse = async (response) => {
        const intent = response.intents[0]?.name;
        let movies = [];

        // Handle various movie-related intents and fetch data accordingly
        switch (intent) {
            case 'recommend_movie':
                movies = await tmdbApi.getPopularMovies();
                break;
            case 'recommend_top_rated_movie':
                movies = await tmdbApi.getTopRatedMovies();
                break;
            case 'recommend_genre_movie':
                const genreId = extractGenreId(response.entities);
                if (genreId) {
                    movies = await tmdbApi.getRandomGenreMovies(genreId);
                } else {
                    return [{ text: "I didn't catch the genre. Could you specify it again?" }];
                }
                break;
            case 'recommend_daily_trending':
                movies = await tmdbApi.getDailyTrendingMovies();
                break;
            case 'recommend_weekly_trending':
                movies = await tmdbApi.getWeeklyTrendingMovies();
                break;
            default:
                return [{ text: "I'm not sure how to help with that. Could you ask something else?" }];
        }

        // Return up to 3 movie recommendations
        if (movies.length > 0) {
            return movies.slice(0, 3).map(movie => {
                return {
                    text: `• ${movie.title}`,
                    movieId: movie.id
                };
            });
        } else {
            return [{ text: "I couldn't find any movies right now. Please try again later." }];
        }
    };

    // Extract the genre ID from the response entities
    const extractGenreId = (entities) => {
        const genreEntity = entities['genre:genre'] || [];
        if (genreEntity.length > 0) {
            const genreName = genreEntity[0].value.toLowerCase();
            const genreMap = {
                'action': 28,
                'adventure': 12,
                'animation': 16,
                'comedy': 35,
                'crime': 80,
                'documentary': 99,
                'drama': 18,
                'family': 10751,
                'fantasy': 14,
                'history': 36,
                'horror': 27,
                'music': 10402,
                'mystery': 9648,
                'romance': 10749,
                'science fiction': 878,
                'tv movie': 10770,
                'thriller': 53,
                'war': 10752,
                'western': 37
            };
            return genreMap[genreName];
        }
        return null;
    };

    // Handle navigation to MovieDetail screen when a movie suggestion is clicked
    const handleMoviePress = (movieId) => {
        navigation.navigate('MovieDetail', { movieId: movieId });
    };

    // Render custom message bubbles in the chat
    const renderMessage = (props) => {
        const { currentMessage } = props;

        // Display movie title and make it clickable for movie details
        if (currentMessage.movieId) {
            return (
                <TouchableOpacity onPress={() => handleMoviePress(currentMessage.movieId)}>
                    <View style={styles.movieBubble}>
                        <Text style={styles.movieText}>{currentMessage.text}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{currentMessage.text}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Render the header component */}
            <Header />
            <View style={styles.container}>
                {/* Display suggestions for chatbot interaction */}
                <View style={styles.suggestionsHeaderContainer}>
                    <Text style={styles.suggestionsHeaderText}>Here are some questions you may ask:</Text>
                </View>
                <ScrollView 
                    style={styles.suggestionsContainer} 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                >
                    {suggestions.map((suggestion, index) => (
                        <TouchableOpacity
                            key={`suggestion_${index}`}
                            style={styles.suggestionButton}
                            onPress={() => onSend(suggestion)}
                        >
                            <Text style={styles.suggestionText}>{suggestion}</Text>
                        </TouchableOpacity>

                    ))}
                </ScrollView>
                {/* Display chat conversation */}
                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={messages}
                        onSend={messages => onSend(messages[0].text)}
                        user={{ _id: 1 }}
                        renderMessage={renderMessage}
                        renderBubble={(props) => (
                            <View style={styles.bubbleContainer}>
                                {props.children}
                            </View>
                        )}
                        renderInputToolbar={() => null}
                    />
                </View>
                {/* Display input field and send button */}
                <View style={styles.inputToolbarContainer}>
                    <TextInput
                        style={styles.inputText}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor="#ecf0f1"
                        onSubmitEditing={() => onSend()}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={() => onSend()}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Style for the safe area
    safeArea: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the main container
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    // Style for the suggestions header
    suggestionsHeaderContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    // Style for the suggestions list
    suggestionsContainer: {
        flexDirection: 'row',
        padding: 5,
        paddingVertical: 10,
        maxHeight: 50,
    },
    // Style for the chat container
    chatContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#1e1e1e',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    // Style for the message bubble container
    bubbleContainer: {
        backgroundColor: '#2c3e50',
        borderRadius: 10,
        padding: 10,
    },
    // Style for the input toolbar container
    inputToolbarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 2,
        borderTopColor: '#9b59b6',
        backgroundColor: '#1e1e1e',
    },
    // Style for the text input
    inputText: {
        flex: 1,
        color: '#ecf0f1',
        backgroundColor: '#34495e',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    // Style for the send button
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#9b59b6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    // Style for the send button text
    sendButtonText: {
        color: '#ecf0f1',
        fontSize: 16,
    },
    // Style for regular message container
    messageContainer: {
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        borderWidth: 2,
        borderColor: '#9b59b6',
    },
    // Style for regular message text
    messageText: {
        color: '#ecf0f1',
        fontSize: 16,
    },
    // Style for the movie suggestion bubble
    movieBubble: {
        backgroundColor: '#9b59b6',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    // Style for the movie suggestion text
    movieText: {
        color: '#ecf0f1',
        fontSize: 16,
    },
    // Style for the suggestions header text
    suggestionsHeaderText: {
        color: '#ecf0f1',
        fontSize: 16,
        marginBottom: 5,
    },
    // Style for each suggestion button
    suggestionButton: {
        backgroundColor: '#9b59b6',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        minWidth: 150,
    },
    // Style for suggestion button text
    suggestionText: {
        color: '#ecf0f1',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default ChatbotScreen;
