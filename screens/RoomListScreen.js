import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    TextInput,
    Button,
} from 'react-native';
import { ref, onValue, remove, push } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { rtdb, auth } from '../firebaseConfig';

const RoomListScreen = ({ navigation, route }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const { nickname } = route.params;

    // ✅ 우측 상단 로그아웃 버튼 설정
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="로그아웃" onPress={handleLogout} color="red" />
            ),
        });
    }, [navigation]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace('Auth');
        } catch (e) {
            Alert.alert('로그아웃 실패', e.message);
        }
    };

    useEffect(() => {
        const roomsRef = ref(rtdb, 'rooms');
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const roomList = Object.entries(data).map(([id, value]) => ({
                    id,
                    name: value.name,
                    lastMessageTime: value.lastMessageTime || 0,
                }));

                // ✅ 최신 메시지 순 정렬
                roomList.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

                setRooms(roomList);
            } else {
                setRooms([]);
            }
        });

        return () => unsubscribe();
    }, []);

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
                    navigation.navigate('ChatScreen', {
                        roomId: item.id,
                        roomName: item.name,
                        nickname: nickname,
                    })
                }
            >
                <Text style={styles.roomName}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteRoom(item.id)}>
                <Text style={styles.deleteButton}>삭제</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* 채팅방 생성 영역 */}
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

            {/* 채팅방 목록 */}
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
    roomName: { fontSize: 18 },
    deleteButton: { color: 'red', marginLeft: 10 },
    separator: { height: 1, backgroundColor: '#ccc' },
});

export default RoomListScreen;
