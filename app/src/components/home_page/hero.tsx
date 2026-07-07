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
        <section className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden border-b bg-[radial-gradient(circle_at_74%_28%,rgba(69,112,232,0.14),transparent_22rem),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,249,253,0.78))]">
            <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,1fr)] lg:px-8">
            <div className="relative z-10 max-w-3xl">
                <p className="mb-5 inline-flex rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase text-primary shadow-sm">
                    AI engineering roadmaps
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.04] tracking-normal text-foreground sm:text-6xl lg:text-7xl">Train for the next frontier of engineering.</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-xl">
                    QuantumEd turns advanced science and computing into a guided mission:
                    structured roadmaps, practical lessons and zero-cost access.
                </p>
                <dl id="developer-counter" className="mt-10 grid w-fit min-w-40 gap-1 rounded-lg border border-primary/10 bg-white/85 px-5 py-4 text-sm text-muted-foreground shadow-[0_18px_50px_rgba(36,73,136,0.14)] backdrop-blur">
                    <dt>Active cadets</dt>
                    <dd className="text-3xl font-semibold text-foreground">{developerCount}</dd>
                </dl>
            </div>

            <div className="relative hidden min-h-[38rem] lg:block" aria-hidden="true">
                <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),transparent_62%)] blur-2xl" />
                <img className="absolute right-6 top-8 w-80 drop-shadow-[0_28px_60px_rgba(50,61,92,0.24)]" src="/assets/backgrounds/planet-indigo-shadow.png" alt="" />
                <img className="absolute left-10 top-28 w-40 drop-shadow-[0_20px_42px_rgba(0,120,105,0.22)]" src="/assets/backgrounds/planet-teal-shadow.png" alt="" />
                <img className="absolute bottom-14 right-0 w-48 drop-shadow-[0_24px_46px_rgba(119,56,25,0.24)]" src="/assets/backgrounds/planet-copper-shadow.png" alt="" />
                <img className="absolute bottom-4 left-28 w-32 drop-shadow-[0_18px_34px_rgba(83,28,100,0.24)]" src="/assets/backgrounds/planet-violet-shadow.png" alt="" />
                <img className="absolute right-80 top-72 w-28 drop-shadow-[0_16px_28px_rgba(63,91,49,0.22)]" src="/assets/backgrounds/planet-forest-shadow.png" alt="" />
            </div>
            </div>
        </section>
    )
}
