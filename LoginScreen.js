import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import ProfileScreen from "./ProfileScreen";

export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Alert.alert("❌ Error", "Please fill in all fields!");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                profile_picture: "",
                posts: [],
            });

            Alert.alert("✅ Success", "Account created successfully!");
            navigation.replace("Profile");
        } catch (error) {
            if (error.code === "auth/email-already-in-use"){
                Alert.alert("⚠️ Email is already taken. Try logging in instead.", error.message);
            }else {
                Alert.alert("❌ Error", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogIn = async () => {
        if (!email || !password) {
            Alert.alert("❌ Error", "Please fill in both email and password!");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                console.log("User data:", userDocSnap.data());
            } else {
                console.log("No user data found!");
            }

            Alert.alert("✅ Success", "Login successful!");
            navigation.replace("Profile");
        } catch (error) {
            Alert.alert("❌ Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up To PawFinder</Text>

            {/* Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Full name"
                value={name}
                onChangeText={setName}
            />

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            {/* Password Input */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Buttons Container */}
            <View style={styles.buttonContainer}>
                {/* Sign Up Button */}
                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? <Text>Loading...</Text> : <Text style={styles.buttonText}>Sign Up</Text>}
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity style={styles.button2} onPress={handleLogIn} disabled={loading}>
                    {loading ? <Text>Loading...</Text> : <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F6F4EB",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4682A9",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 15,
        borderWidth: 1,
        borderColor: "#749BC2",
        borderRadius: 10,
        backgroundColor: "#91C8E4",
        marginBottom: 10,
        color: "#000",
    },
    buttonContainer: {
        flexDirection: "row", // Ensures buttons appear side by side
        justifyContent: "space-between",
        width: "100%", // Make sure the buttons fit within the screen width
    },
    button: {
        backgroundColor: "#4682A9",
        padding: 15,
        borderRadius: 10,
        width: "48%", // Takes up 48% of the width to allow both buttons to fit
        alignItems: "center",
        marginRight: 5, // Adds space between the buttons
    },
    buttonText: {
        color: "#F6F4EB",
        fontWeight: "bold",
        fontSize: 16,
    },
    button2: {
        backgroundColor: "#749BC2", // Differentiated color
        padding: 15,
        borderRadius: 10,
        width: "48%", // Same width as the first button
        alignItems: "center",
        marginLeft: 5, // Adds space between the buttons
    },
});
