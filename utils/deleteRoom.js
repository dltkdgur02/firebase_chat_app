// utils/deleteRoom.js
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const deleteRoom = async (roomId) => {
    try {
        // 1. 하위 메시지 컬렉션 삭제
        const messagesRef = collection(db, 'rooms', roomId, 'messages');
        const messagesSnap = await getDocs(messagesRef);

        const deletePromises = messagesSnap.docs.map((msgDoc) =>
            deleteDoc(doc(db, 'rooms', roomId, 'messages', msgDoc.id))
        );
        await Promise.all(deletePromises);

        // 2. 채팅방 문서 삭제
        await deleteDoc(doc(db, 'rooms', roomId));
    } catch (error) {
        console.error('채팅방 삭제 실패:', error);
        throw error;
    }
};
