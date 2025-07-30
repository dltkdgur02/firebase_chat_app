import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref as dbRef, get, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, rtdb, storage } from '../firebaseConfig';

const ProfileScreen = () => {
    const uid = auth.currentUser?.uid;
    const [name, setName] = useState('');
    const [photoUrl, setPhotoUrl] = useState(null);

    // 프로필 정보 로딩
    useEffect(() => {
        if (!uid) return;
        const userRef = dbRef(rtdb, `users/${uid}`);
        get(userRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                setName(data.name || '');
                setPhotoUrl(data.photoUrl || null);
            }
        });
    }, [uid]);

    // 갤러리에서 이미지 선택
    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.IMAGE,
            quality: 0.5,
        });

        if (!result.canceled) {
            setPhotoUrl(result.assets[0].uri);
        }
    };

    // 저장 버튼
    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('이름을 입력하세요.');
            return;
        }

        try {
            let uploadedUrl = photoUrl;

            await set(dbRef(rtdb, `users/${uid}`), {
                name,
                photoUrl: uploadedUrl,
            });

            Alert.alert('프로필이 저장되었습니다.');
        } catch (error) {
            Alert.alert('오류 발생', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePickImage}>
                {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={{ color: '#aaa' }}>사진 선택</Text>
                    </View>
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="이름 입력"
            />
            <Button title="저장" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 20 },
    image: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
});

export default ProfileScreen;
