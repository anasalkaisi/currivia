import type {
  CurriculumConfig,
  ModulePlan,
  ModuleRecord,
  PlanSemester,
} from '@currivia/schema';
import { evaluateForecastCredits, evaluateTotalCredits } from '@currivia/rules';
import { useEffect, useMemo, useState } from 'react';

import { areaLabels, content, statusOptions } from '../content';
import { formatGrade } from '../format';
import { usePlan } from '../plan/usePlan';

/**
 * Formats a credit value expressed in hundredths using German number formatting.
 *
 * @param hundredths - The credit value multiplied by 100
 * @returns The formatted credit value
 */
function formatCredits(hundredths: number): string {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 2,
  }).format(hundredths / 100);
}

function semesterLabel(semester: PlanSemester): string {
  return semester.calendarSemester.label;
}

/**
 * Converts a semester kind into its display label.
 *
 * @param kind - The semester kind to label.
 * @returns The localized label for the semester kind.
 */
function kindLabel(kind: PlanSemester['kind']): string {
  if (kind === 'vacation') return 'Urlaubssemester';
  if (kind === 'interruption') return 'Unterbrechungssemester';
  return 'Reguläres Fachsemester';
}

/**
 * Renders the semester-based curriculum planner.
 *
 * @param config - Curriculum configuration used to display the planned module and credit progress
 */
export function Planner({ config }: { config: CurriculumConfig }) {
  const {
    plan,
    saveState,
    setPassed,
    resetOpen,
    moveModule,
    undoLastMove,
    undoModulePlans,
    confirmCurrentSemester,
    confirmSpecialSemester,
    addSpecialSemester,
  } = usePlan();
  const [focusedSemesterId, setFocusedSemesterId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!plan) return;
    const historicalRecord = plan.moduleRecords[0];
    const historicalAssignment = historicalRecord
      ? plan.modulePlans.find(
          (modulePlan) =>
            modulePlan.curriculumItemId === historicalRecord.curriculumItemId,
        )
      : undefined;
    const preferredFocus =
      historicalAssignment?.semesterId ?? plan.currentSemesterId;
    setFocusedSemesterId((current) =>
      current && plan.semesters.some((semester) => semester.id === current)
        ? current
        : preferredFocus,
    );
  }, [plan]);

  const focusedId = focusedSemesterId ?? plan?.currentSemesterId ?? '';
  const focusedIndex = Math.max(
    0,
    plan?.semesters.findIndex((semester) => semester.id === focusedId) ?? 0,
  );
  const visibleSemesters = useMemo(
    () =>
      plan?.semesters.slice(
        Math.max(0, focusedIndex - 1),
        Math.min(plan.semesters.length, focusedIndex + 2),
      ) ?? [],
    [focusedIndex, plan],
  );

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
  const modulePlan = plan.modulePlans.find(
    (candidate) => candidate.curriculumItemId === item.id,
  );
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
  const forecast = evaluateForecastCredits(config, plan, focusedId);

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
          <h1>Semester für Semester.</h1>
          <p className="planner-lede">
            Plane deine zeitliche Reihenfolge. Der Ist-Zustand bleibt immer
            offiziell bestätigt; die Prognose ist ein sichtbares „Wenn alles
            bestanden wird“.
          </p>
        </div>
        <div className="progress-block" aria-label="Fortschritt">
          <div className="progress-metric progress-metric-current">
            <span>Ist · bestanden</span>
            <strong aria-live="polite">
              {formatCredits(result.currentHundredths)} /{' '}
              {formatCredits(result.targetHundredths)} ECTS
            </strong>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Bestandene ECTS"
              aria-valuemin={0}
              aria-valuemax={result.targetHundredths / 100}
              aria-valuenow={result.currentHundredths / 100}
              aria-valuetext={`${formatCredits(result.currentHundredths)} von ${formatCredits(result.targetHundredths)} ECTS bestanden`}
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
          <div className="progress-metric progress-metric-forecast">
            <span>Prognose · wenn alles bestanden wird</span>
            <strong aria-live="polite">
              {formatCredits(forecast.forecastHundredths)} /{' '}
              {formatCredits(result.targetHundredths)} ECTS prognostiziert
            </strong>
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

      {!plan.currentSemesterConfirmed && (
        <section
          className="semester-confirmation"
          aria-labelledby="current-semester-title"
        >
          <div>
            <p className="section-kicker">Zeitliche Einordnung</p>
            <h2 id="current-semester-title">
              Vorschlag: aktuelles Hochschulsemester ist{' '}
              {semesterLabel(
                plan.semesters.find(
                  (semester) => semester.id === plan.currentSemesterId,
                ) ?? plan.semesters[0]!,
              )}
            </h2>
            <p>
              Das Datum liefert nur eine Orientierung. Bestätige die Einordnung
              anhand deiner offiziellen Unterlagen.
            </p>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={confirmCurrentSemester}
          >
            Vorschlag bestätigen
          </button>
        </section>
      )}

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

      <nav className="semester-strip" aria-label="Semester auswählen">
        {plan.semesters.map((semester) => (
          <button
            className={semester.id === focusedId ? 'is-active' : ''}
            type="button"
            key={semester.id}
            aria-current={semester.id === focusedId ? 'page' : undefined}
            onClick={() => setFocusedSemesterId(semester.id)}
          >
            <span>
              {semester.fachsemester
                ? `FS ${semester.fachsemester}`
                : 'Sondersemester'}
            </span>
            <strong>{semesterLabel(semester)}</strong>
          </button>
        ))}
      </nav>

      <section className="semester-grid" aria-label="Semesterplan">
        {visibleSemesters.map((semester) => (
          <SemesterCard
            key={semester.id}
            semester={semester}
            isFocused={semester.id === focusedId}
            item={item}
            record={record}
            modulePlan={modulePlan}
            status={status}
            component={component}
            componentStatus={componentStatus}
            hasContradiction={hasContradiction}
            hasDetailedRecord={hasDetailedRecord}
            saveState={saveState}
            semesters={plan.semesters}
            onMove={moveModule}
            onSetPassed={setPassed}
            onResetOpen={resetOpen}
            onFocus={setFocusedSemesterId}
            onConfirmSpecialSemester={confirmSpecialSemester}
          />
        ))}
      </section>

      {modulePlan?.semesterId === null && (
        <section className="unplanned-tray" aria-labelledby="unplanned-title">
          <div>
            <p className="section-kicker">Parkposition</p>
            <h2 id="unplanned-title">Noch nicht eingeplant</h2>
            <p>
              Das Modul bleibt im Katalog sichtbar, ist aber keinem Semester
              zugeordnet.
            </p>
          </div>
          <span className="unplanned-chip">{item.officialCode}</span>
        </section>
      )}

      <section className="semester-actions" aria-label="Semesteraktionen">
        <div>
          <p className="section-kicker">Zeitachse erweitern</p>
          <h2>Sondersemester ergänzen</h2>
          <p>
            Ein Urlaubs- oder Unterbrechungssemester erhöht das Fachsemester
            nicht automatisch.
          </p>
        </div>
        <div className="semester-action-buttons">
          <button
            className="secondary-button"
            type="button"
            onClick={() => addSpecialSemester('vacation')}
          >
            + Urlaubssemester
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => addSpecialSemester('interruption')}
          >
            + Unterbrechung
          </button>
        </div>
      </section>

      {undoModulePlans && (
        <div className="undo-toast" role="status">
          <span>Planungszuordnung geändert.</span>
          <button
            className="secondary-button"
            type="button"
            onClick={undoLastMove}
          >
            Rückgängig
          </button>
        </div>
      )}

      <div className="revision-strip">
        <dl>
          <div>
            <dt>SPO</dt>
            <dd>{config.regulationVersion}</dd>
          </div>
          <div>
            <dt>Semester</dt>
            <dd>{plan.semesters.length} angelegt</dd>
          </div>
          <div>
            <dt>Speicherort</dt>
            <dd>Nur dieser Browser</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/**
 * Renders a semester card with its identity, planning controls, and assigned module details.
 *
 * @param semester - The semester represented by the card
 * @param isFocused - Whether the semester is currently focused
 * @param item - The curriculum item being planned
 * @param record - The module's official record, if available
 * @param modulePlan - The module's planning assignment, if available
 * @param status - The module's displayed status
 * @param component - The recorded assessment component, if available
 * @param componentStatus - The assessment component's displayed status
 * @param hasContradiction - Whether the module and component statuses conflict
 * @param hasDetailedRecord - Whether detailed official history exists
 * @param saveState - The current local-save state
 * @param semesters - The semesters available for planning
 * @param onMove - Moves or unassigns the module
 * @param onSetPassed - Marks the module as passed
 * @param onResetOpen - Resets a minimally recorded passed module to open
 * @param onFocus - Focuses a semester
 * @param onConfirmSpecialSemester - Confirms the special semester's classification
 */
function SemesterCard({
  semester,
  isFocused,
  item,
  record,
  modulePlan,
  status,
  component,
  componentStatus,
  hasContradiction,
  hasDetailedRecord,
  saveState,
  semesters,
  onMove,
  onSetPassed,
  onResetOpen,
  onFocus,
  onConfirmSpecialSemester,
}: {
  semester: PlanSemester;
  isFocused: boolean;
  item: CurriculumConfig['curriculumItems'][number];
  record: ModuleRecord | undefined;
  modulePlan: ModulePlan | undefined;
  status: (typeof statusOptions)[number] | undefined;
  component:
    | NonNullable<NonNullable<typeof record>['componentRecords']>[number]
    | undefined;
  componentStatus: (typeof statusOptions)[number] | undefined;
  hasContradiction: boolean;
  hasDetailedRecord: boolean;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  semesters: PlanSemester[];
  onMove: (itemId: string, semesterId: string | null) => void;
  onSetPassed: (itemId: string) => void;
  onResetOpen: (itemId: string) => void;
  onFocus: (semesterId: string) => void;
  onConfirmSpecialSemester: (semesterId: string) => void;
}) {
  const itemIsHere = modulePlan?.semesterId === semester.id;
  return (
    <article
      className={`semester-sheet ${isFocused ? 'is-focused' : ''}`}
      aria-labelledby={`semester-title-${semester.id}`}
    >
      <header className="semester-header">
        <div>
          <span>
            {semester.fachsemester
              ? `FS ${String(semester.fachsemester).padStart(2, '0')}`
              : 'Sondersemester'}
          </span>
          <h2 id={`semester-title-${semester.id}`}>
            {semesterLabel(semester)}
          </h2>
          <p>{kindLabel(semester.kind)}</p>
        </div>
        {!isFocused && (
          <button
            className="text-button"
            type="button"
            onClick={() => onFocus(semester.id)}
          >
            Fokussieren →
          </button>
        )}
      </header>

      {semester.kind !== 'regular' && !semester.fachsemesterConfirmed && (
        <div className="special-semester-confirmation">
          <p>
            Fachsemesterzählung nicht automatisch erhöht. Bestätige die
            Einordnung anhand deiner offiziellen Unterlagen.
          </p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => onConfirmSpecialSemester(semester.id)}
          >
            Fachsemesterzählung bestätigen
          </button>
        </div>
      )}

      {itemIsHere ? (
        <div className="module-card">
          <div className="module-code">{item.officialCode}</div>
          <div className="module-main">
            <div className="module-title-row">
              <div>
                <p>{areaLabels[item.area]}</p>
                <h3 id={`module-title-${semester.id}`}>{item.title.de}</h3>
              </div>
              <strong>{formatCredits(item.creditsHundredths)} ECTS</strong>
            </div>

            <div className="status-row">
              <p
                className={`status-badge ${record?.officialStatus === 'BE' ? 'status-passed' : ''}`}
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true">
                  {record?.officialStatus === 'BE' ? '✓' : '○'}
                </span>
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
                aria-labelledby={`component-title-${semester.id}`}
              >
                <div>
                  <p className="component-kicker">Prüfungsbestandteile</p>
                  <h4 id={`component-title-${semester.id}`}>
                    {item.assessment.title.de}
                  </h4>
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

            <div className="planning-panel">
              <label htmlFor={`move-${semester.id}`}>
                <span>Planungssemester</span>
                <select
                  id={`move-${semester.id}`}
                  value={modulePlan?.semesterId ?? ''}
                  onChange={(event) =>
                    onMove(item.id, event.target.value || null)
                  }
                >
                  <option value="">Noch nicht eingeplant</option>
                  {semesters.map((target) => (
                    <option key={target.id} value={target.id}>
                      {target.fachsemester
                        ? `${target.fachsemester}. Fachsemester · `
                        : ''}
                      {semesterLabel(target)}
                    </option>
                  ))}
                </select>
              </label>
              {modulePlan?.availability === 'unconfirmed' && (
                <p className="availability-note">
                  <strong>Verfügbarkeit nicht bestätigt.</strong> Diese
                  Information stammt nicht aus einer offiziellen Angebotszusage.
                </p>
              )}
            </div>

            <div className="module-actions">
              {record?.officialStatus === 'BE' && !hasDetailedRecord ? (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onResetOpen(item.id)}
                >
                  Auf „offen“ zurücksetzen
                </button>
              ) : !record ? (
                <button
                  className="primary-button compact"
                  type="button"
                  onClick={() => onSetPassed(item.id)}
                >
                  Als bestanden markieren
                </button>
              ) : (
                <a className="secondary-button" href="#/history">
                  Offiziellen Status bearbeiten
                </a>
              )}
              <a className="source-link" href={`#/sources/${item.id}`}>
                Quelle anzeigen <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-semester">
          <span aria-hidden="true">—</span>
          <p>Keine Planung in diesem Semester.</p>
          <small>Nutze die Semesterleiste, um den Verlauf zu prüfen.</small>
        </div>
      )}
    </article>
  );
}
