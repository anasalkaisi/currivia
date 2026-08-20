import type { ReactNode } from 'react';
import type { MouseEvent } from 'react';

import { content } from '../content';

/**
 * Provides the shared page structure for application content.
 *
 * @returns The application shell containing accessibility navigation, header, main content, and footer.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const skipToMain = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.querySelector<HTMLElement>('#main-content')?.focus();
  };

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={skipToMain}>
        Zum Inhalt springen
      </a>
      <div className="site-frame">
        <header className="site-header">
          <a
            className="wordmark"
            href="#/onboarding"
            aria-label="Currivia Startseite"
          >
            <span className="wordmark-mark" aria-hidden="true">
              C
            </span>
            <span>
              <strong>{content.brand}</strong>
              <small>{content.productName}</small>
            </span>
          </a>
          <p className="pilot-label">{content.pilotLine}</p>
        </header>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <p>{content.disclaimer}</p>
          <p>Lokale S3-Entwicklung · keine öffentliche Alpha</p>
        </footer>
      </div>
    </>
  );
}
