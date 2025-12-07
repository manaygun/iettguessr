'use client';

import { useState, useEffect, useCallback } from 'react';
import OnboardingForm from '@/components/OnboardingForm';
import TransportCard from '@/components/TransportCard';
import IstanbulMap from '@/components/IstanbulMap';
import Confetti from '@/components/Confetti';
import ShareCard from '@/components/ShareCard';
import AdBanner from '@/components/AdBanner';
import { UserTransport, getRandomUserFromFirebase, getUserCountFromFirebase } from '@/lib/storage';
import { District, getDistanceBetweenDistricts } from '@/data/districts';

type GamePhase = 'onboarding' | 'loading' | 'playing' | 'result' | 'gameOver';

interface GameState {
  currentUser: UserTransport | null;
  score: number;
  round: number;
  totalRounds: number;
  lastGuessCorrect: boolean | null;
  guessedDistrict: string | null;
  distance: number | null;
}

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('onboarding');
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentUser: null,
    score: 0,
    round: 1,
    totalRounds: 5,
    lastGuessCorrect: null,
    guessedDistrict: null,
    distance: null,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [userCount, setUserCount] = useState(0);

  // Fetch user count on mount
  useEffect(() => {
    const fetchCount = async () => {
      const count = await getUserCountFromFirebase();
      setUserCount(count);
    };
    fetchCount();
  }, []);

  const startNewRound = useCallback(async (excludeId?: string) => {
    const randomUser = await getRandomUserFromFirebase(excludeId);
    if (randomUser) {
      setGameState(prev => ({
        ...prev,
        currentUser: randomUser,
        lastGuessCorrect: null,
        guessedDistrict: null,
        distance: null,
      }));
    }
  }, []);

  const handleOnboardingComplete = async (user: UserTransport) => {
    setMyUserId(user.id);
    setPhase('loading');

    const count = await getUserCountFromFirebase();
    setUserCount(count);
    // If user is alone, they can still play (guess themselves or wait for others)
    const rounds = Math.max(1, Math.min(count, 10)); // At least 1 round

    setGameState(prev => ({ ...prev, totalRounds: rounds }));
    // Don't exclude self if they're the only user
    await startNewRound(count > 1 ? user.id : undefined);
    setPhase('playing');
  };

  const handleDistrictGuess = (district: District) => {
    if (!gameState.currentUser || gameState.lastGuessCorrect !== null) return;

    const isCorrect = district.name === gameState.currentUser.district;
    const distance = isCorrect ? 0 : getDistanceBetweenDistricts(district.name, gameState.currentUser.district);

    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : prev.score,
      lastGuessCorrect: isCorrect,
      guessedDistrict: district.name,
      distance,
    }));

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setPhase('result');
  };

  const handleNextRound = async () => {
    if (gameState.round >= gameState.totalRounds) {
      setPhase('gameOver');
    } else {
      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
      }));
      await startNewRound(myUserId || undefined);
      setPhase('playing');
    }
  };

  const handlePlayAgain = async () => {
    setPhase('loading');
    const count = await getUserCountFromFirebase();
    setUserCount(count);

    setGameState({
      currentUser: null,
      score: 0,
      round: 1,
      totalRounds: Math.max(1, Math.min(count, 10)),
      lastGuessCorrect: null,
      guessedDistrict: null,
      distance: null,
    });

    // Don't exclude self if alone
    await startNewRound(count > 1 && myUserId ? myUserId : undefined);
    setPhase('playing');
  };

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white flex flex-col">
      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚇</span>
            <span className="font-bold text-sm">IETT Guessr</span>
          </div>
          {(phase === 'playing' || phase === 'result') && (
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-1 bg-purple-500/20 rounded-lg text-purple-300 font-medium">
                {gameState.score} puan
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Top Ad Banner */}
      <div className="max-w-lg mx-auto w-full px-4">
        <AdBanner format="horizontal" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto max-w-lg mx-auto w-full px-4 py-2">
        {/* Loading Phase */}
        {phase === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Yolcular yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Onboarding Phase */}
        {phase === 'onboarding' && (
          <OnboardingForm onSubmit={handleOnboardingComplete} />
        )}

        {/* Playing Phase */}
        {phase === 'playing' && gameState.currentUser && (
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-base font-medium text-gray-300">Bu yolcu nerede yaşıyor?</h2>
            </div>

            <TransportCard user={gameState.currentUser} />

            <IstanbulMap
              onDistrictGuess={handleDistrictGuess}
            />
          </div>
        )}

        {/* Result Phase - SAME LAYOUT as playing */}
        {phase === 'result' && gameState.currentUser && (
          <div className="space-y-3">
            {/* Same header position as playing phase */}
            <div className={`text-center py-1 rounded-lg ${gameState.lastGuessCorrect ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-base font-bold">
                {gameState.lastGuessCorrect ? '🎉 Doğru Tahmin!' : `😅 Yanlış! (${gameState.distance} km uzak)`}
              </span>
            </div>

            <TransportCard user={gameState.currentUser} showDistrict={true} />

            <IstanbulMap
              onDistrictGuess={() => { }}
              correctDistrict={gameState.currentUser.district}
              wrongGuess={!gameState.lastGuessCorrect ? gameState.guessedDistrict : null}
              disabled={true}
              showGuessButton={false}
            />

            {/* Button in same position as guess button */}
            <button
              id="next-round-btn"
              onClick={handleNextRound}
              style={{ background: 'linear-gradient(to right, #059669, #047857)' }}
              className="w-full py-3 px-4 text-white font-bold rounded-xl transition-all hover:opacity-90"
            >
              {gameState.round >= gameState.totalRounds ? 'Sonuçları Gör' : 'Sonraki Yolcu →'}
            </button>
          </div>
        )}

        {/* Game Over Phase */}
        {phase === 'gameOver' && (
          <div className="space-y-6">
            <ShareCard
              score={gameState.score}
              totalRounds={gameState.totalRounds}
              onShare={() => { }}
            />

            <button
              onClick={handlePlayAgain}
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
            >
              🔄 Tekrar Oyna
            </button>
          </div>
        )}
      </div>

      {/* Bottom Ad Banner */}
      <div className="max-w-lg mx-auto w-full px-4 pb-2">
        <AdBanner format="horizontal" />
      </div>
    </main>
  );
}
