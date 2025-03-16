import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./firebaseConfig";  // Import Firebase Auth
import LoginScreen from "./LoginScreen";
import AppNavigator from "./AppNavigator"; // Your TabNavigator (Feed, Profile, etc.)

const Stack = createStackNavigator();

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status on app load
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setIsLoggedIn(true); // User is logged in
            } else {
                setIsLoggedIn(false); // User is not logged in
            }
        });
        return () => unsubscribe();  // Clean up the listener
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <Stack.Screen name="App" component={AppNavigator} />
                ) : (
                    <Stack.Screen name="LogIn" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
