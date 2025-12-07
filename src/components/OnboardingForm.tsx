'use client';

import { useState } from 'react';
import { districts } from '@/data/districts';
import { addUserToFirebase, UserTransport } from '@/lib/storage';

interface OnboardingFormProps {
    onSubmit: (user: UserTransport) => void;
}

export default function OnboardingForm({ onSubmit }: OnboardingFormProps) {
    const [formData, setFormData] = useState({
        district: '',
        metrobus: '',
        marmaray: '',
        vapur: '',
        metro: '',
        otobus: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if data looks realistic
    const isRealisticData = (data: { metrobus: number; marmaray: number; vapur: number; metro: number; otobus: number }): boolean => {
        const values = [data.metrobus, data.marmaray, data.vapur, data.metro, data.otobus];
        const total = values.reduce((a, b) => a + b, 0);

        // Too low: total under 30 or all values under 10
        if (total < 30 || values.every(v => v < 10)) return false;

        // Too high: total over 2000 or any single value over 500
        if (total > 2000 || values.some(v => v > 500)) return false;

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const userData = {
            district: formData.district,
            metrobus: parseInt(formData.metrobus) || 0,
            marmaray: parseInt(formData.marmaray) || 0,
            vapur: parseInt(formData.vapur) || 0,
            metro: parseInt(formData.metro) || 0,
            otobus: parseInt(formData.otobus) || 0,
        };

        try {
            // Only save to Firebase if data looks realistic
            if (isRealisticData(userData)) {
                const user = await addUserToFirebase(userData);
                onSubmit(user);
            } else {
                // Let user play but don't save unrealistic data
                console.log('Unrealistic data - not saving to Firebase');
                onSubmit({
                    id: `temp_${Date.now()}`,
                    ...userData
                });
            }
        } catch (error) {
            console.error('Error saving data:', error);
            // Still let user play even if Firebase fails
            onSubmit({
                id: `temp_${Date.now()}`,
                ...userData
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const transportTypes = [
        { key: 'metrobus', label: 'Metrobüs', icon: '🚌', color: 'from-yellow-400 to-amber-500', placeholder: '157' },
        { key: 'marmaray', label: 'Marmaray', icon: '🚃', color: 'from-red-400 to-red-600', placeholder: '89' },
        { key: 'vapur', label: 'Vapur', icon: '⛴️', color: 'from-blue-400 to-blue-600', placeholder: '45' },
        { key: 'metro', label: 'Metro', icon: '🚇', color: 'from-purple-400 to-purple-600', placeholder: '203' },
        { key: 'otobus', label: 'Otobüs', icon: '🚍', color: 'from-green-400 to-green-600', placeholder: '120' },
    ];

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Transport Stats - Compact Grid */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <h3 className="text-xs font-medium text-gray-400 mb-2">Yıllık Biniş Sayılarınız</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {transportTypes.map(({ key, label, icon, color, placeholder }) => (
                            <div key={key} className="text-center">
                                <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-1`}>
                                    <span className="text-sm">{icon}</span>
                                </div>
                                <input
                                    type="number"
                                    name={key}
                                    value={formData[key as keyof typeof formData]}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    min="0"
                                    className="w-full px-1 py-1.5 bg-gray-800 border border-white/20 rounded-lg text-white placeholder:text-gray-600/50 text-center text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                                />
                                <p className="text-[9px] text-gray-500 mt-0.5 truncate">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* District Selection - Moved to bottom */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                        📍 İlçeniz
                    </label>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2.5 bg-gray-800 border border-white/20 rounded-lg text-white focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                    >
                        <option value="" className="bg-gray-800">İlçe seçin...</option>
                        {districts.map(d => (
                            <option key={d.id} value={d.name} className="bg-gray-800">
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !formData.district}
                    style={{ background: isSubmitting || !formData.district ? '#334155' : 'linear-gradient(to right, #059669, #047857)' }}
                    className="w-full py-3 px-4 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet ve Oyna 🎮'}
                </button>
            </form>
        </div>
    );
}
