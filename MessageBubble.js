import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const MessageBubble = ({ text, sender, posts, renderPost }) => (
    <View style={[styles.message, sender === "user" ? styles.userMessage : styles.botMessage]}>
        <Text style={styles.messageText}>{text}</Text>
        {posts && (
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderPost(item)}
            />
        )}
    </View>
);

const styles = StyleSheet.create({
    message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
    userMessage: { alignSelf: "flex-end", backgroundColor: "#749BC2" },
    botMessage: { alignSelf: "flex-start", backgroundColor: "#ddd" },
    messageText: { color: "black" },
});

export default MessageBubble;