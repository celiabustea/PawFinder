import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPrompt, setShowPrompt] = useState(false);
    const [phone, setPhone] = useState("");

    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigation.replace("Login");
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUser(data);

                    if (!data.phone) {
                        setShowPrompt(true);
                    }
                } else {
                    console.log("No user data found in Firestore");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace("Login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const handleEdit = async () => {

    }

    const handleAddPhone = async () => {
        if (!phone.trim()) {
            Alert.alert("❌ Error", "Please enter a valid phone number!");
            return;
        }

        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { phone });

            Alert.alert("✅ Success", "Phone number added!");
            setShowPrompt(false);
        } catch (error) {
            Alert.alert("❌ Error", "Could not save phone number!");
            console.error(error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#4682A9" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>PawFinder</Text>
            </View>

            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: user?.profile_picture || "https://via.placeholder.com/100" }}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
            </View>

            {/* Phone Number Prompt */}
            {showPrompt && (
                <View style={styles.phoneContainer}>
                    <Text style={styles.phoneText}>📞 Add your phone number so you can be contacted:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <TouchableOpacity style={styles.addPhoneButton} onPress={handleAddPhone}>
                        <Text style={styles.addPhoneButtonText}>Save Phone</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editButtontext}>Edit Profile</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F4EB",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
    },
    header: {
        backgroundColor: "#4682A9",
        paddingVertical: 15,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 20,
    },
    headerText: {
        color: "#F6F4EB",
        fontSize: 22,
        fontWeight: "bold",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#4682A9",
    },
    userInfo: {
        marginLeft: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4682A9",
    },
    email: {
        fontSize: 14,
        color: "#749BC2",
        marginTop: 5,
    },
    phoneContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#91C8E4",
        borderRadius: 10,
    },
    phoneText: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    addPhoneButton: {
        backgroundColor: "#4682A9",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    addPhoneButtonText: {
        color: "#F6F4EB",
        fontSize: 16,
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#749BC2",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow
    },
    logoutText: {
        color: "#F6F4EB",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
