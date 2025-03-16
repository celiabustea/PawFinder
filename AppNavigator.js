import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import { Image} from "react-native"

import FeedScreen from './FeedScreen';
import AddPostScreen from './AddPostScreen';
import ProfileScreen from './ProfileScreen';
import ChatBotScreen from "./ChatBotScreen";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconSource;
                    if (route.name === 'Feed') {
                        iconSource = require('./assets/home-2503.png');
                    } else if (route.name === 'AddPost') {
                        iconSource = require('./assets/add-button-12017.png');
                    } else if (route.name === 'Profile') {
                        iconSource = require('./assets/user-4250.png');
                    }else if (route.name === 'ChatBot') {
                        iconSource= require('./assets/ai.png');
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={{ width: size, height: size, tintColor: color }}  // Adjust size and color
                        />
                    );
                },
            })}
            tabBarOptions={{
                activeTintColor: '#4682A9', // Active icon color
                inactiveTintColor: 'gray',  // Inactive icon color
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 60,  // Adjust height of the tab bar
                },
                tabBarLabelStyle: {
                    fontSize: 14,  // Label font size
                },
            }}
        >
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{ headerShown: false }} // Hide header for Feed screen
            />
            <Tab.Screen
                name="AddPost"
                component={AddPostScreen}
                options={{ headerShown: false }} // Hide header for AddPost screen
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }} // Hide header for Profile screen
            />
            <Tab.Screen
                name="ChatBot"
                component={ChatBotScreen}
                options={{ headerShown: false }}
            />

        </Tab.Navigator>
    );
};

export default AppNavigator;
