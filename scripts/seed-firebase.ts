// Script to seed Firebase with realistic Istanbul commuter data
// Run with: npx ts-node --esm scripts/seed-firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBKQi30oi4pZ2I4CPCPWdCMR3jzhWVcURM",
    authDomain: "toplutasima-aa2bd.firebaseapp.com",
    projectId: "toplutasima-aa2bd",
    storageBucket: "toplutasima-aa2bd.firebasestorage.app",
    messagingSenderId: "597205286990",
    appId: "1:597205286990:web:4a1092575c49526202c31f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Istanbul districts with realistic transport patterns
const districtPatterns: Record<string, { metro: number; metrobus: number; marmaray: number; vapur: number; otobus: number }> = {
    // Asian side - high Marmaray usage
    'Kadıköy': { metro: 180, metrobus: 30, marmaray: 250, vapur: 120, otobus: 80 },
    'Üsküdar': { metro: 150, metrobus: 20, marmaray: 280, vapur: 180, otobus: 100 },
    'Maltepe': { metro: 120, metrobus: 15, marmaray: 200, vapur: 30, otobus: 150 },
    'Ataşehir': { metro: 200, metrobus: 25, marmaray: 180, vapur: 10, otobus: 120 },
    'Kartal': { metro: 100, metrobus: 10, marmaray: 220, vapur: 25, otobus: 180 },
    'Pendik': { metro: 80, metrobus: 5, marmaray: 250, vapur: 40, otobus: 200 },
    'Tuzla': { metro: 40, metrobus: 5, marmaray: 180, vapur: 60, otobus: 220 },
    'Beykoz': { metro: 20, metrobus: 10, marmaray: 80, vapur: 150, otobus: 250 },
    'Çekmeköy': { metro: 160, metrobus: 10, marmaray: 100, vapur: 5, otobus: 180 },
    'Sancaktepe': { metro: 140, metrobus: 15, marmaray: 120, vapur: 5, otobus: 200 },
    'Sultanbeyli': { metro: 60, metrobus: 20, marmaray: 100, vapur: 5, otobus: 280 },
    'Ümraniye': { metro: 180, metrobus: 30, marmaray: 150, vapur: 5, otobus: 150 },
    'Şile': { metro: 5, metrobus: 0, marmaray: 20, vapur: 30, otobus: 150 },
    'Adalar': { metro: 0, metrobus: 0, marmaray: 50, vapur: 350, otobus: 20 },

    // European side - high Metrobüs usage
    'Beşiktaş': { metro: 200, metrobus: 180, marmaray: 50, vapur: 100, otobus: 80 },
    'Şişli': { metro: 280, metrobus: 200, marmaray: 40, vapur: 20, otobus: 100 },
    'Beyoğlu': { metro: 250, metrobus: 150, marmaray: 60, vapur: 80, otobus: 90 },
    'Fatih': { metro: 220, metrobus: 120, marmaray: 80, vapur: 100, otobus: 150 },
    'Bakırköy': { metro: 180, metrobus: 280, marmaray: 30, vapur: 50, otobus: 120 },
    'Bahçelievler': { metro: 200, metrobus: 320, marmaray: 20, vapur: 10, otobus: 150 },
    'Bağcılar': { metro: 180, metrobus: 350, marmaray: 15, vapur: 5, otobus: 180 },
    'Küçükçekmece': { metro: 150, metrobus: 300, marmaray: 20, vapur: 10, otobus: 200 },
    'Avcılar': { metro: 100, metrobus: 350, marmaray: 10, vapur: 15, otobus: 180 },
    'Beylikdüzü': { metro: 60, metrobus: 400, marmaray: 5, vapur: 5, otobus: 150 },
    'Esenyurt': { metro: 40, metrobus: 380, marmaray: 5, vapur: 0, otobus: 250 },
    'Başakşehir': { metro: 180, metrobus: 250, marmaray: 10, vapur: 0, otobus: 180 },
    'Sultangazi': { metro: 150, metrobus: 200, marmaray: 5, vapur: 0, otobus: 250 },
    'Gaziosmanpaşa': { metro: 120, metrobus: 180, marmaray: 10, vapur: 5, otobus: 220 },
    'Eyüpsultan': { metro: 160, metrobus: 150, marmaray: 20, vapur: 30, otobus: 180 },
    'Kağıthane': { metro: 200, metrobus: 180, marmaray: 15, vapur: 10, otobus: 140 },
    'Sarıyer': { metro: 100, metrobus: 80, marmaray: 20, vapur: 60, otobus: 200 },
    'Zeytinburnu': { metro: 220, metrobus: 280, marmaray: 40, vapur: 20, otobus: 100 },
    'Güngören': { metro: 180, metrobus: 300, marmaray: 25, vapur: 10, otobus: 150 },
    'Esenler': { metro: 160, metrobus: 320, marmaray: 20, vapur: 5, otobus: 180 },
    'Bayrampaşa': { metro: 200, metrobus: 250, marmaray: 30, vapur: 10, otobus: 140 },
    'Arnavutköy': { metro: 20, metrobus: 100, marmaray: 5, vapur: 0, otobus: 280 },
    'Çatalca': { metro: 5, metrobus: 30, marmaray: 5, vapur: 10, otobus: 200 },
    'Silivri': { metro: 5, metrobus: 50, marmaray: 10, vapur: 20, otobus: 180 },
    'Büyükçekmece': { metro: 30, metrobus: 250, marmaray: 10, vapur: 15, otobus: 200 },
};

function randomVariation(base: number, variance: number = 0.3): number {
    const min = Math.floor(base * (1 - variance));
    const max = Math.ceil(base * (1 + variance));
    return Math.max(0, Math.floor(Math.random() * (max - min + 1)) + min);
}

async function seedDatabase() {
    const districts = Object.keys(districtPatterns);
    const usersToAdd = 40;

    console.log(`Adding ${usersToAdd} users to Firebase...`);

    for (let i = 0; i < usersToAdd; i++) {
        const district = districts[Math.floor(Math.random() * districts.length)];
        const pattern = districtPatterns[district];

        const userData = {
            district,
            metro: randomVariation(pattern.metro),
            metrobus: randomVariation(pattern.metrobus),
            marmaray: randomVariation(pattern.marmaray),
            vapur: randomVariation(pattern.vapur),
            otobus: randomVariation(pattern.otobus),
            createdAt: Timestamp.now(),
        };

        try {
            const docRef = await addDoc(collection(db, 'users'), userData);
            console.log(`${i + 1}. Added user from ${district} (ID: ${docRef.id})`);
        } catch (error) {
            console.error(`Error adding user ${i + 1}:`, error);
        }
    }

    console.log('\nDone! Added 40 realistic commuter profiles.');
    process.exit(0);
}

seedDatabase();
