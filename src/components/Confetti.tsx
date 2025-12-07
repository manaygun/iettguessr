'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
    active: boolean;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    velocityX: number;
    velocityY: number;
}

export default function Confetti({ active }: ConfettiProps) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!active) {
            setParticles([]);
            return;
        }

        const colors = ['#FFB800', '#C41E3A', '#0066B3', '#5C4B99', '#228B22', '#FF6B6B', '#4ECDC4'];
        const newParticles: Particle[] = [];

        for (let i = 0; i < 50; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 8 + Math.random() * 8,
                velocityX: (Math.random() - 0.5) * 3,
                velocityY: 2 + Math.random() * 3,
            });
        }

        setParticles(newParticles);

        const timeout = setTimeout(() => {
            setParticles([]);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [active]);

    if (!active || particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-confetti"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        transform: `rotate(${particle.rotation}deg)`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${2 + Math.random()}s`,
                    }}
                />
            ))}
        </div>
    );
}
