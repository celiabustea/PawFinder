import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth } from "./firebaseConfig";

const AddPostScreen = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState("Lost"); // Default to "Lost"
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need permission to access your photo gallery to select images.');
            }
        })();
    }, []);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log("Picked image URI:", result.assets[0].uri);  // Log the URI
            setImage(result.assets[0].uri); // Update image URI
        } else {
            console.log("No image selected.");
        }
    };


    const uploadImage = async (uri) => {
        if (!uri) return null; // If no image was selected, return null

        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const storage = getStorage();
            const storageRef = ref(storage, `posts/${auth.currentUser.uid}_${Date.now()}.jpg`);
            console.log("Uploading image to:", storageRef); // Log storage reference

            await uploadBytes(storageRef, blob);
            console.log("Image uploaded successfully!");

            const imageUrl = await getDownloadURL(storageRef);
            console.log("Image URL:", imageUrl);  // Log the image URL
            return imageUrl;  // Return the image URL
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };
    const handlePost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        let imageUrl = null;

        if (image) {
            imageUrl = await uploadImage(image);
        }

        try {
            const postData = {
                title,
                content,
                type: postType, // "Lost" or "Found"
                author: auth.currentUser?.uid,
                timestamp: serverTimestamp(),
                imageurl: imageUrl, // This will be null if no image was uploaded
            };

            await addDoc(collection(db, "posts"), postData);

            Alert.alert("Success", "Your post has been added!");
            navigation.goBack();
        } catch (error) {
            console.error("Error adding post:", error);
            Alert.alert("Error", "Could not add post. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* PawFinder Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>PawFinder</Text>
            </View>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Enter description"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <Text style={styles.label}>Post Type</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.typeButton, postType === "Lost" && styles.selectedButton]}
                    onPress={() => setPostType("Lost")}
                >
                    <Text style={styles.buttonText}>Lost</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeButton, postType === "Found" && styles.selectedButton]}
                    onPress={() => setPostType("Found")}
                >
                    <Text style={styles.buttonText}>Found</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Text style={styles.imagePickerText}>Select an Image (Optional)</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            <TouchableOpacity style={styles.postButton} onPress={handlePost} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.postButtonText}>Post</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F4EB",
    },
    header: {
        backgroundColor: "#4682A9",
        paddingVertical: 15,
        paddingHorizontal:20,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 20,
        marginBottom:25,
    },
    headerText: {
        color: "#F6F4EB",
        fontSize: 24,
        fontWeight: "700",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4682A9",
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    typeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: "#91C8E4",
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: "#4682A9",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    imagePicker: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#91C8E4",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        zIndex: 1,
    },
    imagePickerText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    postButton: {
        backgroundColor: "#4682A9",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    postButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddPostScreen;
