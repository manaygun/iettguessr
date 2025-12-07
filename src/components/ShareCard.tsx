'use client';

interface ShareCardProps {
    score: number;
    totalRounds: number;
    onShare: () => void;
}

export default function ShareCard({ score, totalRounds, onShare }: ShareCardProps) {
    const maxScore = totalRounds * 10;
    const percentage = Math.round((score / maxScore) * 100);

    const getTitle = () => {
        if (percentage >= 80) return '🏆 Ulaşım Ustası';
        if (percentage >= 60) return '🎯 İstanbul Kaşifi';
        if (percentage >= 40) return '🚌 Yolcu Adayı';
        return '🗺️ Turist';
    };

    const getMessage = () => {
        if (percentage >= 80) return 'İstanbul ulaşımını avucunun içi gibi biliyorsun!';
        if (percentage >= 60) return 'İstanbul seni şaşırtamaz!';
        if (percentage >= 40) return 'Biraz daha pratik yapmaya ne dersin?';
        return 'İstanbul hâlâ seni keşfetmeyi bekliyor!';
    };

    const shareText = `${getTitle()} - IETT Guessr'da ${score}/${maxScore} puan aldım! 🚇🚌⛴️ Sen de dene!`;

    const handleTwitterShare = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(shareText + ' #IstanbulWrapped');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        onShare();
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
            alert('Link kopyalandı!');
        } catch {
            console.error('Copy failed');
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 shadow-2xl">
                {/* Trophy/Medal Icon */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-xl mb-3">
                        <span className="text-4xl">{percentage >= 60 ? '🏆' : '🎮'}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
                    <p className="text-gray-400 text-sm mt-1">{getMessage()}</p>
                </div>

                {/* Score Display */}
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Skor</span>
                        <span className="text-3xl font-bold text-white">
                            {score}<span className="text-lg text-gray-400"> puan</span>
                        </span>
                    </div>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">{percentage}% doğruluk</p>
                </div>

                {/* Share Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleTwitterShare}
                        className="w-full py-3 px-4 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X&apos;te Paylaş
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-white/20"
                    >
                        📋 Linki Kopyala
                    </button>
                </div>
            </div>
        </div>
    );
}
