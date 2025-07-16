import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen';
import RoomListScreen from './screens/RoomListScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Auth">
                <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Rooms" component={RoomListScreen} options={{ title: '채팅방 목록' }} />
                <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.roomName })} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
