import type { CurriculumConfig } from '@currivia/schema';

import { areaLabels } from '../content';
import { usePlan } from '../plan/usePlan';

function formatSourceDate(value: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function SourceDetails({
  config,
  itemId,
}: {
  config: CurriculumConfig;
  itemId: string;
}) {
  const { plan } = usePlan();
  const item = config.curriculumItems.find(
    (candidate) => candidate.id === itemId,
  );

  if (!item) {
    return (
      <section className="state-page" aria-labelledby="unknown-source-title">
        <p className="section-kicker">Unbekannte Quellenreferenz</p>
        <h1 id="unknown-source-title">Diese Fundstelle existiert nicht.</h1>
        <a className="text-link" href={plan ? '#/planner' : '#/onboarding'}>
          Zurück
        </a>
      </section>
    );
  }

  const sources = config.sources.filter((source) =>
    item.sourceRefs.includes(source.id),
  );

  return (
    <div className="source-page">
      <a className="back-link" href={plan ? '#/planner' : '#/onboarding'}>
        <span aria-hidden="true">←</span> Zurück zum{' '}
        {plan ? 'Plan' : 'Einstieg'}
      </a>
      <header className="source-heading">
        <p className="section-kicker">Quellennachweis · {item.officialCode}</p>
        <h1>{item.title.de}</h1>
        <p>
          Die sichtbaren S1-Fakten stammen aus den folgenden offiziellen,
          versionierten Unterlagen.
        </p>
      </header>

      <section className="fact-ledger" aria-labelledby="facts-title">
        <div className="ledger-title">
          <span aria-hidden="true">A</span>
          <h2 id="facts-title">Verwendete Fakten</h2>
        </div>
        <dl>
          <div>
            <dt>Regelgeneration</dt>
            <dd>{config.regulationVersion}</dd>
          </div>
          <div>
            <dt>Quellenrevision</dt>
            <dd>{config.sourceRevision}</dd>
          </div>
          <div>
            <dt>Modul</dt>
            <dd>
              {item.officialCode} · {item.title.de}
            </dd>
          </div>
          <div>
            <dt>Einordnung</dt>
            <dd>
              {areaLabels[item.area]} · Fachsemester {item.recommendedSemester}
            </dd>
          </div>
          <div>
            <dt>Umfang</dt>
            <dd>{item.creditsHundredths / 100} ECTS</dd>
          </div>
          <div>
            <dt>Voraussetzungen</dt>
            <dd>Keine formalen Modulvoraussetzungen</dd>
          </div>
        </dl>
      </section>

      <section className="source-list" aria-labelledby="sources-title">
        <div className="ledger-title">
          <span aria-hidden="true">B</span>
          <h2 id="sources-title">Offizielle Fundstellen</h2>
        </div>
        {sources.map((source) => (
          <article className="source-card" key={source.id}>
            <div className="source-id">{source.id}</div>
            <h3>{source.documentTitle}</h3>
            <p>
              {source.publisher} · abgerufen am{' '}
              {formatSourceDate(source.retrievedAt)}
            </p>
            <ul>
              {source.locations.map((location) => (
                <li key={location.label}>
                  <strong>{location.label}</strong>
                  <span>{location.fact}</span>
                </li>
              ))}
            </ul>
            <a href={source.officialUrl} target="_blank" rel="noreferrer">
              Offizielle Quelle öffnen <span aria-hidden="true">↗</span>
            </a>
            <details>
              <summary>Dateinachweis</summary>
              <code>SHA-256: {source.fileSha256}</code>
            </details>
          </article>
        ))}
      </section>

      <aside className="verification-note">
        <strong>Prüfstatus</strong>
        <p>
          Die Fundstellen wurden selbst geprüft. Die unabhängige fachliche
          Zweitprüfung steht noch aus.
        </p>
      </aside>
    </div>
  );
}
