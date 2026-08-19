import { content } from '../content';

export function LoadingPage() {
  return (
    <section className="state-page" aria-live="polite" aria-busy="true">
      <p className="section-kicker">Lokaler Speicher</p>
      <h1>Plan wird sicher geladen …</h1>
    </section>
  );
}

export function InvalidStoragePage() {
  return (
    <section
      className="state-page error-page"
      role="alert"
      aria-labelledby="storage-error-title"
    >
      <p className="section-kicker">Sicherer Ladeabbruch</p>
      <h1 id="storage-error-title">{content.invalidStorageTitle}</h1>
      <p>{content.invalidStorageBody}</p>
      <p className="error-reference">Diagnose: S2-STORAGE-INVALID</p>
    </section>
  );
}

export function InvalidConfigurationPage() {
  return (
    <section
      className="state-page error-page"
      role="alert"
      aria-labelledby="config-error-title"
    >
      <p className="section-kicker">Sicherer Konfigurationsabbruch</p>
      <h1 id="config-error-title">Curriculum kann nicht geladen werden</h1>
      <p>
        Die gebündelte S2-Konfiguration ist ungültig. Der persönliche Planner
        wurde nicht gestartet.
      </p>
      <p className="error-reference">Diagnose: S2-CONFIG-INVALID</p>
    </section>
  );
}
