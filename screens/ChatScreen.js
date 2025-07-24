import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { ref, push, onChildAdded, remove, set } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import MessageItem from '../components/MessageItem';

const ChatScreen = ({ route }) => {
    const { nickname, roomId } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);

    useEffect(() => {
        const messagesRef = ref(rtdb, `messages/${roomId}/`);
        onChildAdded(messagesRef, (snapshot) => {
            const data = snapshot.val();
            setMessages((prev) => [...prev, { key: snapshot.key, ...data }]);
        });
    }, []);

    const handleSend = async () => {
        if (message.trim()) {
            const now = Date.now();
            await push(ref(rtdb, `messages/${roomId}/`), {
                name: nickname,
                text: message,
                timestamp: now,
            });
            // ✅ 채팅방에 최신 메시지 시간 갱신
            await set(ref(rtdb, `rooms/${roomId}/lastMessageTime`), now);

            setMessage('');
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };

    const handleDelete = (messageKey) => {
        const messageRef = ref(rtdb, `messages/${roomId}/${messageKey}`);
        remove(messageRef);
        setMessages((prev) => prev.filter((msg) => msg.key !== messageKey));
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    let lastDate = null;
    const renderItem = ({ item }) => {
        const currentDate = formatDate(item.timestamp);
        const showDateHeader = currentDate !== lastDate;
        lastDate = currentDate;

        return (
            <View>
                {showDateHeader && (
                    <View style={styles.dateHeader}>
                        <Text style={styles.dateHeaderText}>{currentDate}</Text>
                    </View>
                )}
                <MessageItem
                    message={item}
                    isMe={item.name === nickname}
                    onDelete={() => handleDelete(item.key)}
                />
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
                style={styles.list}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
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
    dateHeader: {
        alignItems: 'center',
        marginVertical: 10,
    },
    dateHeaderText: {
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        fontSize: 12,
        color: '#555',
    },
});

export default ChatScreen;
