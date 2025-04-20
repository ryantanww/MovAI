import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BackButton from '../components/BackButton';


const FAQScreen = () => {
    // State to track which question is expanded
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    // Array of FAQs with question and answer
    const faqs = [
        {
            question: 'How can I search for movies?',
            answer: 'You can use the search bar on the Home Screen to search for movies by title. Simply type in the name of the movie and press the search button.',
        },
        {
            question: 'How do I add a movie to my Watchlist?',
            answer: 'When viewing a movie\'s details, tap the heart icon with the "Add to Watchlist" to add it to your Watchlist.',
        },
        {
            question: 'How can I view trending movies?',
            answer: 'On the Home Screen, there\'s a section for trending movies updated weekly. Scroll through the cards to view the most popular and top-rated movies.',
        },
        {
            question: 'Why are random genres displayed on the Home Screen?',
            answer: 'Random genres are shown to help you discover new movies.',
        },
        {
            question: 'How do I remove a movie from my Watchlist?',
            answer: 'Go to your Watchlist and click onto the movie to go into the movie details and tap on the heart icon to remove fom your Watchlist.',
        },
        {
            question: 'What is the source of movie data in this app?',
            answer: 'All movie information is fetched from The Movie Database (TMDB) API.',
        },
        {
            question: 'How often are movie recommendations updated?',
            answer: 'Movie recommendations are updated weekly based on TMDB data. Random genres change each time you reload the app.',
        },
        {
            question: 'Can I see detailed information about a movie?',
            answer: 'Yes! Select a movie from any list to view more information such as its synopsis, release date, and cast.',
        },
        {
            question: 'Why do some movies not show up in search results?',
            answer: 'We rely on the TMDB API for search results. If a movie is missing, it may be due to data availability on TMDB. Try using different keywords or double-checking the spelling.',
        },
    ];

    // Function to toggle the expanded state of a question
    const toggleExpand = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        // SafeAreaView to handle layout on different devices
        <SafeAreaView style={styles.container}>
            {/* Render the header */}
            <Header />

            {/* Display the FAQ title */}
            <Text style={styles.title}>Frequently Asked Questions</Text>

            {/* Scrollable container for FAQ items */}
            <ScrollView>
                <View style={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <View key={index} style={styles.faqItem}>
                            {/* Question that can be tapped to expand or collapse */}
                            <TouchableOpacity onPress={() => toggleExpand(index)}>
                                <Text style={styles.question}>{faq.question}</Text>
                            </TouchableOpacity>

                            {/* Display the answer if the question is expanded */}
                            {expandedQuestion === index && (
                                <Text style={styles.answer}>{faq.answer}</Text>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Render the back button at the bottom */}
            <BackButton />
        </SafeAreaView>
    );
};

// Styles for the FAQ screen
const styles = StyleSheet.create({
    // Style for the SafeAreaView container
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1e1e1e',
    },
    // Style for the FAQ title
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9b59b6',
        textAlign: 'center',
        marginBottom: 20,
    },
    // Style for the FAQ container
    faqContainer: {
        paddingHorizontal: 10,
    },
    // Style for each FAQ item
    faqItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingBottom: 10,
    },
    // Style for the question text
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#9b59b6',
    },
    // Style for the answer text
    answer: {
        marginTop: 10,
        fontSize: 16,
        color: '#bdc3c7',
        textAlign: 'justify',
    },
});

export default FAQScreen;
