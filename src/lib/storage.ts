import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

export interface UserTransport {
    id: string;
    district: string;
    metrobus: number;
    marmaray: number;
    vapur: number;
    metro: number;
    otobus: number;
}

const COLLECTION_NAME = 'users';

// Fallback seed data in case Firebase is empty
const SEED_USERS: UserTransport[] = [
    { id: 'seed_1', district: 'Kadıköy', metrobus: 45, marmaray: 120, vapur: 85, metro: 200, otobus: 50 },
    { id: 'seed_2', district: 'Beşiktaş', metrobus: 180, marmaray: 30, vapur: 60, metro: 150, otobus: 90 },
    { id: 'seed_3', district: 'Üsküdar', metrobus: 20, marmaray: 200, vapur: 150, metro: 80, otobus: 40 },
    { id: 'seed_4', district: 'Bakırköy', metrobus: 250, marmaray: 15, vapur: 25, metro: 100, otobus: 180 },
    { id: 'seed_5', district: 'Maltepe', metrobus: 30, marmaray: 180, vapur: 40, metro: 120, otobus: 60 },
];

// Get all users from Firestore (combined with seed data for fallback)
export const getAllUsersFromFirebase = async (): Promise<UserTransport[]> => {
    try {
        const usersRef = collection(db, COLLECTION_NAME);
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const firebaseUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as UserTransport));

        // Combine Firebase users with seed data
        return [...firebaseUsers, ...SEED_USERS];
    } catch (error) {
        console.error('Error fetching users:', error);
        // Return seed data as fallback if Firebase fails
        return SEED_USERS;
    }
};

// Add a new user to Firestore
export const addUserToFirebase = async (user: Omit<UserTransport, 'id'>): Promise<UserTransport> => {
    try {
        const usersRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(usersRef, {
            ...user,
            createdAt: Timestamp.now()
        });

        return {
            id: docRef.id,
            ...user
        };
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

// Get a random user (excluding the current user's id if provided)
export const getRandomUserFromFirebase = async (excludeId?: string): Promise<UserTransport | null> => {
    const users = await getAllUsersFromFirebase();
    const filteredUsers = excludeId
        ? users.filter(u => u.id !== excludeId)
        : users;

    if (filteredUsers.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredUsers.length);
    return filteredUsers[randomIndex];
};

// Get user count
export const getUserCountFromFirebase = async (): Promise<number> => {
    const users = await getAllUsersFromFirebase();
    return users.length;
};
