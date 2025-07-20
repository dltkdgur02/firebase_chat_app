import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async () => {
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, pw);
            } else {
                await createUserWithEmailAndPassword(auth, email, pw);
            }
            navigation.replace('RoomList', { nickname: email.split('@')[0] });
        } catch (error) {
            Alert.alert('오류', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? '로그인' : '회원가입'}</Text>
            <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={pw}
                onChangeText={setPw}
                secureTextEntry
            />
            <Button title={isLogin ? '로그인' : '회원가입'} onPress={handleAuth} />
            <View style={{ marginTop: 10 }}>
                <Button
                    title={isLogin ? '회원가입으로 전환' : '로그인으로 전환'}
                    onPress={() => setIsLogin(!isLogin)}
                />
            </View>
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
        marginBottom: 15,
        borderRadius: 5,
    },
});

export default AuthScreen;
