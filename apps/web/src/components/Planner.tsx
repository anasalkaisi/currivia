import type { CurriculumConfig } from '@currivia/schema';
import { evaluateTotalCredits } from '@currivia/rules';

import { areaLabels, content, statusOptions } from '../content';
import { usePlan } from '../plan/usePlan';

function formatCredits(hundredths: number): string {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 2,
  }).format(hundredths / 100);
}

function formatGrade(hundredths: number): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(hundredths / 100);
}

export function Planner({ config }: { config: CurriculumConfig }) {
  const { plan, saveState, setPassed, resetOpen } = usePlan();

  if (!plan) {
    return (
      <section className="state-page" aria-labelledby="missing-plan-title">
        <p className="section-kicker">Planner noch nicht eingerichtet</p>
        <h1 id="missing-plan-title">Zuerst die SPO bestätigen</h1>
        <p>
          Für diesen Browser liegt noch kein bestätigter persönlicher Plan vor.
        </p>
        <a className="text-link" href="#/onboarding">
          Zur Einrichtung
        </a>
      </section>
    );
  }

  const item = config.curriculumItems[0];
  if (!item) return null;

  const record = plan.moduleRecords.find(
    (candidate) => candidate.curriculumItemId === item.id,
  );
  const isPassed = record?.officialStatus === 'BE';
  const status = statusOptions.find(
    (option) => option.code === record?.officialStatus,
  );
  const component = record?.componentRecords[0];
  const componentStatus = statusOptions.find(
    (option) => option.code === component?.officialStatus,
  );
  const hasContradiction =
    record?.officialStatus === 'BE' &&
    component !== undefined &&
    ['NB', 'EN'].includes(component.officialStatus);
  const hasDetailedRecord = Boolean(
    record?.semester ||
      record?.officialAttempt ||
      record?.gradeHundredths ||
      record?.componentRecords.length,
  );
  const result = evaluateTotalCredits(config, plan);
  const semester = item.recommendedSemester;

  return (
    <div className="planner-page">
      <aside
        className="development-notice"
        aria-label="Wichtiger Entwicklungsstatus"
      >
        <span className="notice-mark" aria-hidden="true">
          !
        </span>
        <p>{content.developmentWarning}</p>
      </aside>

      <header className="planner-heading">
        <div>
          <p className="section-kicker">Persönlicher Plan · lokal</p>
          <h1>{semester}. Fachsemester</h1>
        </div>
        <div className="progress-block" aria-labelledby="progress-label">
          <span id="progress-label">Bestandene ECTS</span>
          <strong aria-live="polite">
            {formatCredits(result.currentHundredths)} /{' '}
            {formatCredits(result.targetHundredths)} ECTS
          </strong>
          <div
            className="progress-track"
            role="progressbar"
            aria-labelledby="progress-label"
            aria-valuemin={0}
            aria-valuemax={result.targetHundredths / 100}
            aria-valuenow={result.currentHundredths / 100}
            aria-valuetext={`${formatCredits(result.currentHundredths)} von ${formatCredits(result.targetHundredths)} ECTS`}
          >
            <span
              style={{
                width: `${Math.min(
                  100,
                  (result.currentHundredths / result.targetHundredths) * 100,
                )}%`,
              }}
            />
          </div>
        </div>
      </header>

      <nav className="planner-tools" aria-label="Aktionen zum Studienverlauf">
        <div>
          <span>Vergangene Semester</span>
          <strong>Offizielle Angaben aus SELMA übertragen</strong>
        </div>
        <a className="primary-button compact" href="#/history">
          {record ? 'Studienverlauf bearbeiten' : 'Studienverlauf erfassen'}
        </a>
      </nav>

      {record?.officialStatus === 'EN' && (
        <div className="critical-note planner-critical" role="alert">
          <strong>Endgültig nicht bestanden (EN): offiziell klären</strong>
          <p>
            Currivia berechnet daraus keinen Studienabbruch und schlägt keinen
            weiteren Versuch vor. Bitte wende dich umgehend an das Prüfungsamt
            oder die zuständige Studienberatung.
          </p>
        </div>
      )}

      <section className="semester-sheet" aria-labelledby="semester-title">
        <header className="semester-header">
          <div>
            <span>FS {String(semester).padStart(2, '0')}</span>
            <h2 id="semester-title">Vorgesehenes Semester</h2>
          </div>
          <p>1 offizielles Modul</p>
        </header>

        <article className="module-card" aria-labelledby="module-title">
          <div className="module-code">{item.officialCode}</div>
          <div className="module-main">
            <div className="module-title-row">
              <div>
                <p>{areaLabels[item.area]}</p>
                <h3 id="module-title">{item.title.de}</h3>
              </div>
              <strong>{formatCredits(item.creditsHundredths)} ECTS</strong>
            </div>
            <div className="status-row">
              <p
                className={`status-badge ${isPassed ? 'status-passed' : ''}`}
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true">{isPassed ? '✓' : '○'}</span>
                Status: {status ? `${status.label} (${status.code})` : 'Offen'}
              </p>
              <p className="save-status" role="status" aria-live="polite">
                {saveState === 'saving' && 'Wird lokal gespeichert …'}
                {saveState === 'saved' && 'Lokal gespeichert'}
                {saveState === 'error' && 'Lokales Speichern fehlgeschlagen'}
              </p>
            </div>
            {record && (
              <dl className="record-details">
                <div>
                  <dt>Erfasst für</dt>
                  <dd>
                    {record.semester
                      ? `${record.semester}. Fachsemester`
                      : 'Nicht erfasst'}
                  </dd>
                </div>
                <div>
                  <dt>Note</dt>
                  <dd>
                    {record.gradeHundredths
                      ? formatGrade(record.gradeHundredths)
                      : 'Nicht erfasst'}
                  </dd>
                </div>
                <div>
                  <dt>Offizieller Versuch</dt>
                  <dd>{record.officialAttempt ?? 'Nicht erfasst'}</dd>
                </div>
              </dl>
            )}
            {record && (
              <section
                className="component-summary"
                aria-labelledby="component-title"
              >
                <div>
                  <p className="component-kicker">Prüfungsbestandteile</p>
                  <h4 id="component-title">{item.assessment.title.de}</h4>
                </div>
                {component ? (
                  <p>
                    FS {component.semester} · {componentStatus?.label} (
                    {component.officialStatus})
                    {component.officialAttempt
                      ? ` · offizieller Versuch ${component.officialAttempt}`
                      : ''}
                  </p>
                ) : (
                  <p className="unknown-state">
                    Nicht prüfbar · Bestandteildaten nicht erfasst
                  </p>
                )}
              </section>
            )}
            {hasContradiction && (
              <div className="consistency-note" role="status">
                <strong>Angaben wirken widersprüchlich.</strong> Der erfasste
                Bestandteil hat den Status {componentStatus?.label} (
                {component?.officialStatus}), der offizielle Modulstatus ist BE.
                Der Modulstatus bleibt unverändert; prüfe die Übertragung.
              </div>
            )}
            <div className="module-actions">
              {isPassed && !hasDetailedRecord ? (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => resetOpen(item.id)}
                >
                  Auf „offen“ zurücksetzen
                </button>
              ) : !record ? (
                <button
                  className="primary-button compact"
                  type="button"
                  onClick={() => setPassed(item.id)}
                >
                  Als bestanden markieren
                </button>
              ) : (
                <a className="secondary-button" href="#/history">
                  Offiziellen Status bearbeiten
                </a>
              )}
              <a className="source-link" href={`#/sources/${item.id}`}>
                Quelle anzeigen
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </article>
      </section>

      <div className="revision-strip">
        <dl>
          <div>
            <dt>SPO</dt>
            <dd>{config.regulationVersion}</dd>
          </div>
          <div>
            <dt>Quellenrevision</dt>
            <dd>{config.sourceRevision}</dd>
          </div>
          <div>
            <dt>Prüfstatus</dt>
            <dd>noch nicht zweitgeprüft</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
