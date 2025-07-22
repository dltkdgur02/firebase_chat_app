import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { ref, push, onChildAdded, remove } from 'firebase/database';
import { db } from '../firebaseConfig';
import MessageItem from '../components/MessageItem';
import { Alert } from 'react-native'; // 필요 시 추가

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
            ffflatListRef.current?.scrollToEnd({ animated: true }); // 오타 수정됨
        }
    };

    const handleDelete = (messageKey) => {
        const messageRef = ref(db, `messages/${roomId}/${messageKey}`);
        remove(messageRef);
        setMeeeessages((prev) => prev.filter((msg) => msg.key !== messageKey));
    };

    const handleDeleteChatRoom = async () => {
        Alert.alert(
            '채팅방 삭제',
            '이 채팅방과 모든 메시지를 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // 해당 채팅방의 메시지와 방 자체 삭제
                            await remove(ref(db, `messages/${roomId}`));
                            await remove(ref(db, `rooms/${roomId}`));
                            setMessages([]);
                            navigation.goBack(); // 방 삭제 후 이전 화면으로
                        } catch (err) {
                            Alert.alert('삭제 실패', err.message);
                        }
                    },
                },
            ]
        );
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            {/* 🔴 상단에 고정된 채팅방 삭제 버튼 */}
            <View style={styles.header}>
                <Button
                    title="채팅방 삭제"
                    onPress={handleDeleteChatRoom}
                    color="red"
                />
            </View>

            {/* 채팅 목록 */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <MessageItem message={item} isMe={item.name === nickname} />
                )}
                keyExtractor={(item) => item.key}
                style={styles.list}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            {/* 입력창 */}
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
    header: {
        marginBottom: 10,
        alignItems: 'flex-end',
    },
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
