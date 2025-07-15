// screens/ChatScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
} from 'react-native';
import { ref, push, onChildAdded } from 'firebase/database';
import { db } from '../firebaseConfig';
import MessageItem from '../components/MessageItem';

const ChatScreen = ({ route }) => {
    const { nickname } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = ref(db, 'messages/');
        const seen = new Set(); // ✅ 중복 방지용

        onChildAdded(messagesRef, (snapshot) => {
            const key = snapshot.key;
            const data = snapshot.val();

            if (!seen.has(key)) {
                seen.add(key);
                setMessages((prev) => [...prev, { key, ...data }]);
            }
        });
    }, []);


    const handleSend = async () => {
        if (message.trim()) {
            await push(ref(db, 'messages/'), {
                name: nickname,
                text: message,
                timestamp: Date.now(),
            });
            setMessage('');
        }
    };

    const renderItem = ({ item }) => (
        <MessageItem message={item} isMe={item.name === nickname} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                style={styles.list}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="메시지 입력"
                />
                <Button title="전송" onPress={handleSend} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    list: { flex: 1 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        padding: 10,
        marginRight: 8,
    },
    messageContainer: {
        marginBottom: 10,
        backgroundColor: '#f1f1f1',
        padding: 8,
        borderRadius: 5,
    },
    name: {
        fontWeight: 'bold',
    },
});

export default ChatScreen;
