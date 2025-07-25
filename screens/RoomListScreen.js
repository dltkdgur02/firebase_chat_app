// RoomListScreen.js
import React, { useEffect, useState, useLayoutEffect} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    TextInput,
} from 'react-native';
import { ref, onValue, remove, push } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { auth } from '../firebaseConfig';

const RoomListScreen = ({ navigation, route }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const nickname = route.params?.nickname || '익명';


    useEffect(() => {
        const roomsRef = ref(rtdb, 'rooms');
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const roomList = Object.entries(data)
                    .map(([id, value]) => ({
                        id,
                        name: value.name,
                        lastMessageText: value.lastMessageText || '',
                        lastMessageTime: value.lastMessageTime || 0,
                    }))
                    .sort((a, b) => b.lastMessageTime - a.lastMessageTime);
                setRooms(roomList);
            } else {
                setRooms([]);
            }
        });

        return () => unsubscribe();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Text style={{ color: '#007AFF', marginRight: 10 }}>프로필</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const period = hours < 12 ? '오전' : '오후';
        const formattedHours = hours % 12 || 12;
        return `${period} ${formattedHours}:${minutes}`;
    };

    const handleDeleteRoom = (roomId) => {
        Alert.alert(
            '채팅방 삭제',
            '정말 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await remove(ref(rtdb, `rooms/${roomId}`));
                            Alert.alert('삭제 완료', '채팅방이 삭제되었습니다.');
                        } catch (e) {
                            Alert.alert('삭제 오류', e.message);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleCreateRoom = async () => {
        if (!newRoomName.trim()) return;

        try {
            await push(ref(rtdb, 'rooms'), {
                name: newRoomName.trim(),
                lastMessageTime: Date.now(),
            });
            setNewRoomName('');
        } catch (e) {
            Alert.alert('생성 오류', e.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                    navigation.navigate('Chat', {
                        roomId: item.id,
                        roomName: item.name,
                        nickname,
                    })
                }
            >
                <Text style={styles.roomName}>{item.name}</Text>
                <Text style={styles.preview} numberOfLines={1}>{item.lastMessageText}</Text>
                <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteRoom(item.id)}>
                <Text style={styles.deleteButton}>삭제</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="새 채팅방 이름 입력"
                    value={newRoomName}
                    onChangeText={setNewRoomName}
                />
                <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom}>
                    <Text style={{ color: 'white' }}>생성</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 4,
        paddingHorizontal: 10,
        height: 40,
    },
    createButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        justifyContent: 'center',
        marginLeft: 8,
        borderRadius: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    roomName: { fontSize: 18, fontWeight: 'bold' },
    preview: { fontSize: 14, color: '#555' },
    time: { fontSize: 12, color: '#888' },
    deleteButton: { color: 'red', marginLeft: 10 },
    separator: { height: 1, backgroundColor: '#ccc' },
});

export default RoomListScreen;
