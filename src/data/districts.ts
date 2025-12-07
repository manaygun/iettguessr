// Istanbul districts with coordinates for distance calculation
export interface District {
    id: string;
    name: string;
    lat: number;
    lng: number;
    side: 'european' | 'asian';
}

export const districts: District[] = [
    // European Side
    { id: 'adalar', name: 'Adalar', lat: 40.8761, lng: 29.0911, side: 'asian' },
    { id: 'arnavutkoy', name: 'Arnavutköy', lat: 41.1853, lng: 28.7391, side: 'european' },
    { id: 'atasehir', name: 'Ataşehir', lat: 40.9833, lng: 29.1167, side: 'asian' },
    { id: 'avcilar', name: 'Avcılar', lat: 40.9797, lng: 28.7214, side: 'european' },
    { id: 'bagcilar', name: 'Bağcılar', lat: 41.0386, lng: 28.8572, side: 'european' },
    { id: 'bahcelievler', name: 'Bahçelievler', lat: 41.0019, lng: 28.8614, side: 'european' },
    { id: 'bakirkoy', name: 'Bakırköy', lat: 40.9800, lng: 28.8772, side: 'european' },
    { id: 'basaksehir', name: 'Başakşehir', lat: 41.0942, lng: 28.8019, side: 'european' },
    { id: 'bayrampasa', name: 'Bayrampaşa', lat: 41.0464, lng: 28.9044, side: 'european' },
    { id: 'besiktas', name: 'Beşiktaş', lat: 41.0428, lng: 29.0056, side: 'european' },
    { id: 'beykoz', name: 'Beykoz', lat: 41.1322, lng: 29.0969, side: 'asian' },
    { id: 'beylikduzu', name: 'Beylikdüzü', lat: 41.0028, lng: 28.6406, side: 'european' },
    { id: 'beyoglu', name: 'Beyoğlu', lat: 41.0370, lng: 28.9769, side: 'european' },
    { id: 'buyukcekmece', name: 'Büyükçekmece', lat: 41.0214, lng: 28.5858, side: 'european' },
    { id: 'catalca', name: 'Çatalca', lat: 41.1436, lng: 28.4606, side: 'european' },
    { id: 'cekmekoy', name: 'Çekmeköy', lat: 41.0333, lng: 29.1833, side: 'asian' },
    { id: 'esenler', name: 'Esenler', lat: 41.0428, lng: 28.8756, side: 'european' },
    { id: 'esenyurt', name: 'Esenyurt', lat: 41.0333, lng: 28.6833, side: 'european' },
    { id: 'eyupsultan', name: 'Eyüpsultan', lat: 41.0533, lng: 28.9336, side: 'european' },
    { id: 'fatih', name: 'Fatih', lat: 41.0186, lng: 28.9497, side: 'european' },
    { id: 'gaziosmanpasa', name: 'Gaziosmanpaşa', lat: 41.0633, lng: 28.9119, side: 'european' },
    { id: 'gungoren', name: 'Güngören', lat: 41.0194, lng: 28.8756, side: 'european' },
    { id: 'kadikoy', name: 'Kadıköy', lat: 40.9928, lng: 29.0261, side: 'asian' },
    { id: 'kagithane', name: 'Kağıthane', lat: 41.0794, lng: 28.9722, side: 'european' },
    { id: 'kartal', name: 'Kartal', lat: 40.8878, lng: 29.1856, side: 'asian' },
    { id: 'kucukcekmece', name: 'Küçükçekmece', lat: 41.0000, lng: 28.7833, side: 'european' },
    { id: 'maltepe', name: 'Maltepe', lat: 40.9333, lng: 29.1333, side: 'asian' },
    { id: 'pendik', name: 'Pendik', lat: 40.8781, lng: 29.2536, side: 'asian' },
    { id: 'sancaktepe', name: 'Sancaktepe', lat: 41.0028, lng: 29.2306, side: 'asian' },
    { id: 'sariyer', name: 'Sarıyer', lat: 41.1667, lng: 29.0500, side: 'european' },
    { id: 'silivri', name: 'Silivri', lat: 41.0739, lng: 28.2464, side: 'european' },
    { id: 'sultanbeyli', name: 'Sultanbeyli', lat: 40.9597, lng: 29.2653, side: 'asian' },
    { id: 'sultangazi', name: 'Sultangazi', lat: 41.1069, lng: 28.8672, side: 'european' },
    { id: 'sile', name: 'Şile', lat: 41.1750, lng: 29.6125, side: 'asian' },
    { id: 'sisli', name: 'Şişli', lat: 41.0600, lng: 28.9872, side: 'european' },
    { id: 'tuzla', name: 'Tuzla', lat: 40.8167, lng: 29.3000, side: 'asian' },
    { id: 'umraniye', name: 'Ümraniye', lat: 41.0167, lng: 29.1167, side: 'asian' },
    { id: 'uskudar', name: 'Üsküdar', lat: 41.0231, lng: 29.0153, side: 'asian' },
    { id: 'zeytinburnu', name: 'Zeytinburnu', lat: 40.9936, lng: 28.9053, side: 'european' },
];

export const getDistrictByName = (name: string): District | undefined => {
    return districts.find(d => d.name.toLowerCase() === name.toLowerCase());
};

export const getDistrictById = (id: string): District | undefined => {
    return districts.find(d => d.id === id);
};

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

export const getDistanceBetweenDistricts = (district1: string, district2: string): number => {
    const d1 = getDistrictByName(district1);
    const d2 = getDistrictByName(district2);
    if (!d1 || !d2) return 0;
    return calculateDistance(d1.lat, d1.lng, d2.lat, d2.lng);
};
