import { useEffect, useState } from 'react';
import { env } from '../../config/env';

export default function Hero() {
    const [developerCount, setDeveloperCount] = useState('0');

    useEffect(() => {
        let isMounted = true;

        const loadDeveloperCount = async (): Promise<void> => {
            try {
                const response = await fetch(`${env.API_URL}/public/stats`);

                if (!response.ok) {
                    return;
                }

                const data: { developerCount?: number } = await response.json();

                if (!isMounted) {
                    return;
                }

                if (typeof data.developerCount === 'number') {
                    setDeveloperCount(data.developerCount.toLocaleString('en-US'));
                }
            } catch {
                // Keep the fallback value when the stats request fails.
            }
        };

        void loadDeveloperCount();

        return () => {
            isMounted = false;
        };
    }, []);

    return(
        <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b bg-background">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] lg:px-8">
            <div className="relative z-10 max-w-3xl">
                <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">Train for the next frontier of engineering.</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    QuantumEd turns advanced science and computing into a guided mission:
                    structured roadmaps, practical lessons and zero-cost access.
                </p>
                <p id="developer-counter" className="mt-8 inline-grid gap-1 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                    Active cadets
                    <span className="text-2xl font-semibold text-foreground">{developerCount}</span>
                </p>
            </div>

            <div className="relative hidden min-h-[34rem] lg:block" aria-hidden="true">
                <img className="absolute right-8 top-8 w-72 animate-pulse" src="/assets/backgrounds/planet-indigo-shadow.png" alt="" />
                <img className="absolute left-8 top-28 w-36" src="/assets/backgrounds/planet-teal-shadow.png" alt="" />
                <img className="absolute bottom-16 right-4 w-44" src="/assets/backgrounds/planet-copper-shadow.png" alt="" />
                <img className="absolute bottom-4 left-24 w-28" src="/assets/backgrounds/planet-violet-shadow.png" alt="" />
                <img className="absolute right-72 top-64 w-24" src="/assets/backgrounds/planet-forest-shadow.png" alt="" />
            </div>
            </div>
        </section>
    )
}
