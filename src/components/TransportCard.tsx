'use client';

import { UserTransport } from '@/lib/storage';

interface TransportCardProps {
    user: UserTransport;
    showDistrict?: boolean;
}

export default function TransportCard({ user, showDistrict = false }: TransportCardProps) {
    const transportTypes = [
        {
            key: 'metrobus',
            label: 'Metrobüs',
            icon: '🚌',
            color: 'from-yellow-400 to-amber-500',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30'
        },
        {
            key: 'marmaray',
            label: 'Marmaray',
            icon: '🚃',
            color: 'from-red-400 to-red-600',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30'
        },
        {
            key: 'vapur',
            label: 'Vapur',
            icon: '⛴️',
            color: 'from-blue-400 to-blue-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30'
        },
        {
            key: 'metro',
            label: 'Metro',
            icon: '🚇',
            color: 'from-purple-400 to-purple-600',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30'
        },
        {
            key: 'otobus',
            label: 'Otobüs',
            icon: '🚍',
            color: 'from-green-400 to-green-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30'
        },
    ];

    const getHighestTransport = () => {
        const values = {
            metrobus: user.metrobus,
            marmaray: user.marmaray,
            vapur: user.vapur,
            metro: user.metro,
            otobus: user.otobus,
        };
        return Object.entries(values).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    };

    const highest = getHighestTransport();

    return (
        <div className="w-full">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-xs text-gray-400">Aktif Yolcu</span>
                    </div>
                    {showDistrict && (
                        <span className="text-sm font-medium text-white">{user.district}</span>
                    )}
                </div>

                {/* Stats Grid - Compact */}
                <div className="grid grid-cols-5 gap-2">
                    {transportTypes.map(({ key, label, icon, color }) => {
                        const value = user[key as keyof UserTransport] as number;
                        const isHighest = key === highest;

                        return (
                            <div
                                key={key}
                                className={`text-center p-2 rounded-lg ${isHighest ? 'bg-white/10 ring-1 ring-white/30' : 'bg-white/5'}`}
                            >
                                <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-1`}>
                                    <span className="text-sm">{icon}</span>
                                </div>
                                <p className="text-lg font-bold text-white">{value}</p>
                                <p className="text-[10px] text-gray-500 truncate">{label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
