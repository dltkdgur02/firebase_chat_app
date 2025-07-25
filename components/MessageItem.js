import React from 'react';
import { Image, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

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
            <View style={[styles.messageWrapper, isMe ? styles.me : styles.other]}>
                {!isMe && message.photoUrl && (
                    <Image source={{ uri: message.photoUrl }} style={styles.avatar} />
                )}
                <View style={styles.message}>
                    <Text style={styles.name}>{message.name}</Text>
                    <Text>{message.text}</Text>
                    <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    messageWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
        marginTop: 4,
    },
    message: {
        padding: 10,
        borderRadius: 5,
        maxWidth: '80%',
        backgroundColor: '#f8d7da',
    },
    me: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    other: {
        alignSelf: 'flex-start',
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
