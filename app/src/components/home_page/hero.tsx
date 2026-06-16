import { useEffect, useState } from 'react';
import { env } from '../../config/env';
import '../../styles/home_page_css/hero.css';

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
        <section className="main">
            <div className="main__copy">
                <h1>Train for the next frontier of engineering.</h1>
                <p>
                    QuantumEd turns advanced science and computing into a guided mission:
                    structured roadmaps, practical lessons and zero-cost access.
                </p>
                <p id="developer-counter">
                    Active cadets
                    <span>{developerCount}</span>
                </p>
            </div>

            <div className="main__scene" aria-hidden="true">
                <img className="main__planet main__planet--primary" src="/assets/backgrounds/planet-indigo-shadow.png" alt="" />
                <img className="main__planet main__planet--secondary" src="/assets/backgrounds/planet-teal-shadow.png" alt="" />
    
            </div>
        </section>
    )
}
