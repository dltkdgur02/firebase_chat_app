import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebaseConfig';

const RoomListScreen = ({ navigation, route }) => {
    const { nickname } = route.params;
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
        const roomsRef = ref(db, 'rooms/');
        onValue(roomsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const parsed = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
            setRooms(parsed);
        });
    }, []);

    const createRoom = async () => {
        if (newRoomName.trim()) {
            await push(ref(db, 'rooms/'), { name: newRoomName });
            setNewRoomName('');
        }
    };

    const enterRoom = (room) => {
        navigation.navigate('Chat', { roomId: room.id, roomName: room.name, nickname });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>채팅방 목록</Text>
            <FlatList data={rooms} renderItem={({ item }) => (
                <TouchableOpacity onPress={() => enterRoom(item)} style={styles.roomItem}>
                    <Text style={styles.roomName}>{item.name}</Text>
                </TouchableOpacity>
            )} keyExtractor={(item) => item.id} />
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="새 채팅방 이름"
                    style={styles.input}
                    value={newRoomName}
                    onChangeText={setNewRoomName}
                />
                <Button title="방 만들기" onPress={createRoom} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, marginBottom: 10 },
    roomItem: {
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 6,
        marginBottom: 8,
    },
    roomName: { fontSize: 18 },
    inputContainer: {
        marginTop: 20,
        flexDirection: 'row',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 10,
        borderRadius: 5,
    },
});

export default RoomListScreen;
