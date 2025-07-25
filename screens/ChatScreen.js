import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    View,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Text,
} from 'react-native';
import { ref, push, onChildAdded, remove, onValue, update } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import MessageItem from '../components/MessageItem';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { auth } from '../firebaseConfig';
import { get } from 'firebase/database';

const ChatScreen = ({ route, navigation }) => {
    const { nickname, roomId } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);
    const [myProfile, setMyProfile] = useState({ name: '', photoUrl: null });

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const userRef = ref(rtdb, `users/${uid}`);
        get(userRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMyProfile({
                    name: data.name || '',
                    photoUrl: data.photoUrl || '',
                });
            }
        });
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="☰" onPress={() => navigation.navigate('Profile')} />
            ),
        });
    }, [navigation]);

    const handleChangeRoomName = () => {
        Alert.prompt(
            '채팅방 이름 변경',
            '새 채팅방 이름을 입력하세요:',
            async (newName) => {
                if (!newName) return;
                try {
                    await update(ref(rtdb, `rooms/${roomId}`), { name: newName });
                    navigation.setOptions({ title: newName });
                } catch (err) {
                    Alert.alert('오류', err.message);
                }
            }
        );
    };

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
                name: myProfile.name,
                photoUrl: myProfile.photoUrl,
                text: message,
                timestamp: now,
            });
            await update(ref(rtdb, `rooms/${roomId}`), {
                lastMessageTime: now,
                lastMessageText: message,
            });
            setMessage('');
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };

    const handleDelete = (messageKey) => {
        const messageRef = ref(rtdb, `messages/${roomId}/${messageKey}`);
        remove(messageRef);
        setMessages((prev) => prev.filter((msg) => msg.key !== messageKey));
    };

    const groupMessagesByDate = (messages) => {
        let grouped = [];
        let lastDate = null;
        let dateId = 0; // ✅ 날짜 항목에 대한 고유 id 부여

        messages.forEach((msg) => {
            const msgDate = format(new Date(msg.timestamp), 'yyyy년 MM월 dd일 (E)', { locale: ko });

            // 날짜가 바뀌었을 때만 날짜 라벨 추가
            if (msgDate !== lastDate) {
                grouped.push({
                    key: `date-${dateId++}`, // ✅ 고유 key 보장
                    type: 'date',
                    date: msgDate,
                });
                lastDate = msgDate;
            }

            // 메시지는 고유 Firebase 키 사용
            grouped.push({
                ...msg,
                type: 'message',
                key: msg.key, // ✅ 기존 메시지 키 유지
            });
        });

        return grouped;
    };

    const renderItem = ({ item }) => {
        if (item.type === 'date') {
            return (
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
            );
        }

        return (
            <MessageItem
                message={item}
                isMe={item.name === nickname}
                onDelete={() => handleDelete(item.key)}
            />
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <FlatList
                data={groupMessagesByDate(messages)}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
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
    dateContainer: {
        alignItems: 'center',
        marginVertical: 12,
    },
    dateText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666',
    },
});

export default ChatScreen;
