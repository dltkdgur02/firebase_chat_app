import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen';
import RoomListScreen from './screens/RoomListScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Auth">
                <Stack.Screen name="Auth" component={AuthScreen} options={{ title: '로그인' }} />
                <Stack.Screen name="RoomList" component={RoomListScreen} options={{ title: '채팅방 목록' }} />
                <Stack.Screen
                    name="Chat"
                    component={ChatScreen}
                    options={({ route }) => ({ title: route.params?.roomName || '채팅방' })}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '프로필 설정' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
