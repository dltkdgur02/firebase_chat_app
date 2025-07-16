import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NicknameScreen = ({ navigation }) => {
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const checkStoredNickname = async () => {
            const stored = await AsyncStorage.getItem('nickname');
            if (stored) {
                navigation.replace('Chat', { nickname: stored });
            }
        };
        checkStoredNickname();
    }, []);

    const handleEnter = async () => {
        if (nickname.trim()) {
            await AsyncStorage.setItem('nickname', nickname);
            navigation.replace('Chat', { nickname });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>닉네임을 입력하세요</Text>
            <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="예: 이상혁"
            />
            <Button title="입장" onPress={handleEnter} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});

export default NicknameScreen;
