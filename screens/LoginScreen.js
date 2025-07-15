// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [nickname, setNickname] = useState('');

    const handleLogin = () => {
        if (nickname.trim()) {
            navigation.navigate('Chat', { nickname });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>채팅 앱</Text>
            <TextInput
                style={styles.input}
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChangeText={setNickname}
            />
            <Button title="입장하기" onPress={handleLogin} />
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

export default LoginScreen;
