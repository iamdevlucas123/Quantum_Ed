import { useEffect, useState } from 'react';

import '../../styles/home_page_css/cookie_consent.css';

const COOKIE_CONSENT_KEY = 'quantum-ed-cookie-consent';

type ConsentChoice = 'accepted' | 'necessary' | 'not-allowed';

export default function CookieConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedChoice = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    setIsOpen(!storedChoice);
  }, []);

  const saveChoice = (choice: ConsentChoice): void => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cookie-consent" role="region" aria-labelledby="cookie-consent-title">
      <section className="cookie-consent__panel">
        <p className="cookie-consent__eyebrow">Privacy settings</p>
        <h2 id="cookie-consent-title">We use cookies to keep your session and learning progress stable.</h2>
        <p>
          QuantumEd uses essential cookies for authentication, protected routes and secure session refresh.
          Optional cookies help remember interface preferences inside the platform.
        </p>

        <div className="cookie-consent__list" aria-label="Cookie purposes">
          <article>
            <strong>Essential cookies</strong>
            <span>Required for login, session refresh and protected areas like profile.</span>
          </article>
          <article>
            <strong>Preference cookies</strong>
            <span>Used to remember non-critical interface decisions on future visits.</span>
          </article>
        </div>

        <div className="cookie-consent__actions">
          <button className="cookie-consent__button cookie-consent__button--ghost" type="button" onClick={() => saveChoice('not-allowed')}>
            Not allow
          </button>
          <button className="cookie-consent__button cookie-consent__button--secondary" type="button" onClick={() => saveChoice('necessary')}>
            Only necessary
          </button>
          <button className="cookie-consent__button" type="button" onClick={() => saveChoice('accepted')}>
            Accept cookies
          </button>
        </div>
      </section>
    </div>
  );
}
