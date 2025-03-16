import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Text, Image } from "react-native";
import { interpretUserInput } from "./api";
import { searchLostAnimals } from "./firebase";
import MessageBubble from "./MessageBubble";

const ChatBotScreen = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMessages([{ id: 1, text: "Hi! I'm here to help you find your lost pet. Can you describe it?", sender: "bot" }]);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { id: messages.length + 1, text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const details = await interpretUserInput(input);
            const posts = await searchLostAnimals(details);

            const botMessage = {
                id: messages.length + 2,
                text: posts.length ? "I found these posts:" : "No matches found. Can you give more details?",
                sender: "bot",
                posts: posts.length ? posts : null,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, { id: messages.length + 2, text: "Something went wrong. Please try again.", sender: "bot" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderPost = (post) => (
        <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            {post.imageurl && <Image source={{ uri: post.imageurl }} style={styles.postImage} />}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* PawFinder Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>PawFinder</Text>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MessageBubble text={item.text} sender={item.sender} posts={item.posts} renderPost={renderPost} />
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                    editable={!isLoading}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F4EB",
        padding: 10,
    },
    header: {
        backgroundColor: "#4682A9",
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 20,
        marginBottom: 25,
    },
    headerText: {
        color: "#F6F4EB",
        fontSize: 24,
        fontWeight: "700",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    sendButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: "#4682A9",
        borderRadius: 8,
    },
    sendText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    postContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    postTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
    postContent: {
        marginTop: 5,
    },
    postImage: {
        width: "100%",
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
});

export default ChatBotScreen;