'use client';

import { useState, useCallback } from 'react';
import { districts, District } from '@/data/districts';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import './IstanbulMap.css';

// Dynamic import to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(
    () => import('./IstanbulMapLeaflet'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[200px] w-full rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1e293b' }}>
                <span className="text-gray-400 text-sm">Harita yükleniyor...</span>
            </div>
        )
    }
);

interface IstanbulMapProps {
    onDistrictGuess: (district: District) => void;
    highlightedDistrict?: string | null;
    correctDistrict?: string | null;
    wrongGuess?: string | null;
    disabled?: boolean;
    showGuessButton?: boolean;
}

export default function IstanbulMap({
    onDistrictGuess,
    highlightedDistrict,
    correctDistrict,
    wrongGuess,
    disabled = false,
    showGuessButton = true
}: IstanbulMapProps) {
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!disabled) {
            setSelectedDistrict(e.target.value);
        }
    };

    const handleDistrictClick = useCallback((districtName: string) => {
        if (!disabled) {
            setSelectedDistrict(districtName);
        }
    }, [disabled]);

    const handleDistrictHover = useCallback(() => { }, []);

    const handleGuess = () => {
        if (selectedDistrict && !disabled) {
            const district = districts.find(d => d.name === selectedDistrict);
            if (district) {
                onDistrictGuess(district);
                setSelectedDistrict('');
            }
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Native Select - Same as data entry page */}
            {!disabled && (
                <select
                    value={selectedDistrict}
                    onChange={handleSelectChange}
                    disabled={disabled}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-white/20 rounded-lg text-white focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                    style={{ backgroundColor: '#1f2937' }}
                >
                    <option value="" style={{ backgroundColor: '#1f2937' }}>İlçe seç...</option>
                    <optgroup label="Avrupa Yakası" style={{ backgroundColor: '#1f2937' }}>
                        {districts.filter(d => d.side === 'european').sort((a, b) => a.name.localeCompare(b.name, 'tr')).map(d => (
                            <option key={d.id} value={d.name} style={{ backgroundColor: '#1f2937' }}>
                                {d.name}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="Asya Yakası" style={{ backgroundColor: '#1f2937' }}>
                        {districts.filter(d => d.side === 'asian').sort((a, b) => a.name.localeCompare(b.name, 'tr')).map(d => (
                            <option key={d.id} value={d.name} style={{ backgroundColor: '#1f2937' }}>
                                {d.name}
                            </option>
                        ))}
                    </optgroup>
                </select>
            )}

            {/* Map */}
            <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid #475569' }}>
                <MapWithNoSSR
                    onDistrictClick={handleDistrictClick}
                    onDistrictHover={handleDistrictHover}
                    correctDistrict={correctDistrict || null}
                    wrongGuess={wrongGuess || null}
                    disabled={disabled}
                />

                {/* Selected district indicator on map */}
                {selectedDistrict && !disabled && (
                    <div
                        className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-white text-sm font-medium shadow-xl"
                        style={{ backgroundColor: '#059669', zIndex: 1000 }}
                    >
                        {selectedDistrict}
                    </div>
                )}

                {/* Result overlay - shows correct/wrong on map */}
                {(correctDistrict || wrongGuess) && (
                    <div
                        className="absolute bottom-2 left-2 right-2 p-2 rounded-lg"
                        style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000 }}
                    >
                        {wrongGuess && correctDistrict && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-red-400">❌ {wrongGuess}</span>
                                <span className="text-green-400">✅ {correctDistrict}</span>
                            </div>
                        )}
                        {!wrongGuess && correctDistrict && (
                            <div className="text-center text-green-400 text-sm font-medium">
                                ✅ Doğru! {correctDistrict}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Guess Button */}
            {showGuessButton && !disabled && (
                <button
                    onClick={handleGuess}
                    disabled={!selectedDistrict}
                    style={{
                        background: selectedDistrict
                            ? 'linear-gradient(to right, #059669, #047857)'
                            : '#334155'
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all text-white ${!selectedDistrict ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                    {selectedDistrict ? `Tahmin Et: ${selectedDistrict}` : 'Önce bir ilçe seç'}
                </button>
            )}
        </div>
    );
}
