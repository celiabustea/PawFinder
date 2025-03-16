import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale'; // Opțional - pentru formatare în română

const PostCard = ({ title, author, content, timestamp }) => {
    const formattedDate = format(new Date(timestamp), 'dd MMMM yyyy, HH:mm', { locale: ro });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.author}>@{author}</Text>
            </View>

            <Text style={styles.content}>{content}</Text>

            <View style={styles.footer}>
                <Text style={styles.timestamp}>{formattedDate}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        width: '90%',
        elevation: 3,
        shadowColor: '#749BC2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#91C8E4',
        paddingBottom: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4682A9',
        marginBottom: 4,
    },
    author: {
        fontSize: 14,
        color: '#749BC2',
    },
    content: {
        fontSize: 14,
        color: '#5A5A5A',
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#91C8E4',
        paddingTop: 8,
    },
    timestamp: {
        fontSize: 12,
        color: '#749BC2',
        textAlign: 'right',
    },
});

export default PostCard;