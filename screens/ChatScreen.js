import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { ref, push, onChildAdded, remove } from 'firebase/database';
import { db } from '../firebaseConfig';
import MessageItem from '../components/MessageItem';

const ChatScreen = ({ route }) => {
    const { nickname, roomId } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);

    useEffect(() => {
        const messagesRef = ref(db, `messages/${roomId}/`);
        onChildAdded(messagesRef, (snapshot) => {
            const data = snapshot.val();
            setMessages((prev) => [...prev, { key: snapshot.key, ...data }]);
        });
    }, []);

    const handleSend = async () => {
        if (message.trim()) {
            await push(ref(db, `messages/${roomId}/`), {
                name: nickname,
                text: message,
                timestamp: Date.now(),
            });
            setMessage('');
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };

    const handleDelete = (messageKey) => {
        const messageRef = ref(db, `messages/${roomId}/${messageKey}`);
        remove(messageRef);
        setMessages((prev) => prev.filter((msg) => msg.key !== messageKey));
    };

    const renderItem = ({ item }) => (
        <MessageItem
            message={item}
            isMe={item.name === nickname}
            onDelete={() => handleDelete(item.key)}
        />
    );

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const period = hours < 12 ? '오전' : '오후';
        const formattedHours = hours % 12 || 12;
        return `${period} ${formattedHours}:${minutes}`;
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <MessageItem message={item} isMe={item.name === nickname} />
                )}
                keyExtractor={(item) => item.key}
                style={styles.list}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="메시지 입력"
                    onSubmitEditing={handleSend}
                />
                <Button title="전송" onPress={handleSend} />
            </View>
        </KeyboardAvoidingView>
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
});

export default ChatScreen;
