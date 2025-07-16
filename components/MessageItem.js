import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const formattedHours = hours % 12 || 12;
    return `${period} ${formattedHours}:${minutes}`;
};

const MessageItem = ({ message, isMe, onDelete }) => {
    const handleLongPress = () => {
        if (isMe) {
            Alert.alert('메시지 삭제', '이 메시지를 삭제할까요?', [
                { text: '취소', style: 'cancel' },
                { text: '삭제', style: 'destructive', onPress: onDelete },
            ]);
        }
    };

    return (
        <TouchableOpacity onLongPress={handleLongPress}>
            <View style={[styles.message, isMe ? styles.me : styles.other]}>
                <Text style={styles.name}>{message.name}</Text>
                <Text>{message.text}</Text>
                <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    message: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 8,
        maxWidth: '80%',
    },
    me: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1e7dd',
    },
    other: {
        alignSelf: 'flex-start',
        backgroundColor: '#f8d7da',
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    time: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
        textAlign: 'right',
    },
});

export default MessageItem;
