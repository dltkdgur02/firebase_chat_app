// components/MessageItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 시간 포맷 함수
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours < 12 ? '오전' : '오후';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${ampm} ${formattedHours}:${formattedMinutes}`;
};

const MessageItem = ({ message, isMe }) => {
    return (
        <View style={[styles.messageWrapper, isMe ? styles.myWrapper : styles.otherWrapper]}>
            <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
                <Text style={styles.name}>{message.name}</Text>
                <Text style={styles.text}>{message.text}</Text>
                <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageWrapper: {
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    myWrapper: {
        alignItems: 'flex-end',
    },
    otherWrapper: {
        alignItems: 'flex-start',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#d1fcd3',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#eee',
        alignSelf: 'flex-start',
    },
    name: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
    },
    time: {
        marginTop: 4,
        fontSize: 12,
        color: '#555',
        textAlign: 'right',
    },
});

export default MessageItem;
