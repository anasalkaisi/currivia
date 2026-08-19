import type {
  CurriculumConfig,
  ModuleRecord,
  OfficialStatus,
} from '@currivia/schema';
import { useState } from 'react';

import { statusOptions } from '../content';
import { usePlan } from '../plan/usePlan';
import { navigate } from '../routes';

function formatGrade(hundredths: number): string {
  return (hundredths / 100).toFixed(1).replace('.', ',');
}

function isPositiveInteger(value: string): boolean {
  return /^[1-9]\d*$/.test(value);
}

function isOptionalPositiveInteger(value: string): boolean {
  return value === '' || isPositiveInteger(value);
}

export function HistoryWizard({ config }: { config: CurriculumConfig }) {
  const { plan, saveState, saveModuleRecord } = usePlan();
  const item = config.curriculumItems[0];
  const existing = plan?.moduleRecords.find(
    (record) => record.curriculumItemId === item?.id,
  );
  const [step, setStep] = useState(1);
  const [semester, setSemester] = useState(
    existing?.semester?.toString() ?? '',
  );
  const [selected, setSelected] = useState(Boolean(existing));
  const [status, setStatus] = useState<OfficialStatus | ''>(
    existing?.officialStatus ?? '',
  );
  const [grade, setGrade] = useState(
    existing?.gradeHundredths?.toString() ?? '',
  );
  const [attempt, setAttempt] = useState(
    existing?.officialAttempt?.toString() ?? '',
  );
  const existingComponent = existing?.componentRecords[0];
  const [includeComponent, setIncludeComponent] = useState(
    Boolean(existingComponent),
  );
  const [componentStatus, setComponentStatus] = useState<OfficialStatus | ''>(
    existingComponent?.officialStatus ?? '',
  );
  const [componentSemester, setComponentSemester] = useState(
    existingComponent?.semester?.toString() ??
      existing?.semester?.toString() ??
      '',
  );
  const [componentSemesterWasEdited, setComponentSemesterWasEdited] = useState(
    Boolean(existingComponent),
  );
  const [componentAttempt, setComponentAttempt] = useState(
    existingComponent?.officialAttempt?.toString() ?? '',
  );
  const [finishRequested, setFinishRequested] = useState(false);

  if (!plan || !item) {
    return (
      <section className="state-page">
        <h1>Kein persönlicher Plan vorhanden</h1>
        <a className="text-link" href="#/onboarding">
          Zur Einrichtung
        </a>
      </section>
    );
  }

  const gradeIsValid =
    grade === '' ||
    config.gradingScale.allowedHundredths.includes(Number(grade));
  const attemptIsValid = isOptionalPositiveInteger(attempt);
  const componentFieldsAreValid =
    !includeComponent ||
    (componentStatus !== '' &&
      isPositiveInteger(componentSemester) &&
      isOptionalPositiveInteger(componentAttempt));
  const canFinish =
    selected &&
    status !== '' &&
    isPositiveInteger(semester) &&
    gradeIsValid &&
    attemptIsValid &&
    componentFieldsAreValid;
  const canContinue =
    (step === 1 && isPositiveInteger(semester)) ||
    (step === 2 && selected) ||
    (step === 3 && status !== '') ||
    (step === 4 && gradeIsValid && attemptIsValid);

  const finish = async () => {
    if (!status || !canFinish || finishRequested) return;
    const componentRecords: ModuleRecord['componentRecords'] = [];
    if (includeComponent) {
      if (!componentStatus) return;
      componentRecords.push({
        componentId: item.assessment.id,
        semester: Number(componentSemester),
        officialStatus: componentStatus,
        ...(componentAttempt
          ? { officialAttempt: Number(componentAttempt) }
          : {}),
      });
    }
    setFinishRequested(true);
    try {
      await saveModuleRecord({
        curriculumItemId: item.id,
        semester: Number(semester),
        officialStatus: status,
        ...(attempt ? { officialAttempt: Number(attempt) } : {}),
        ...(grade ? { gradeHundredths: Number(grade) } : {}),
        componentRecords,
      });
      navigate('/planner');
    } catch {
      setFinishRequested(false);
    }
  };

  return (
    <div className="history-page">
      <a className="back-link" href="#/planner">
        ← Zurück zum Planner
      </a>
      <header className="wizard-heading">
        <div>
          <p className="section-kicker">Bestehender Studienverlauf</p>
          <h1>Was steht in SELMA?</h1>
          <p>
            Übertrage nur offizielle Angaben. Currivia zählt keine Versuche
            selbst hoch und deutet keine Rechtsfolgen.
          </p>
        </div>
        <ol className="step-list" aria-label="Fortschritt der Erfassung">
          {['Semester', 'Module', 'Status', 'Details', 'Prüfung'].map(
            (label, index) => (
              <li
                key={label}
                className={step === index + 1 ? 'active' : ''}
                aria-current={step === index + 1 ? 'step' : undefined}
              >
                <span>{String(index + 1).padStart(2, '0')}</span> {label}
              </li>
            ),
          )}
        </ol>
      </header>

      <section className="wizard-card" aria-labelledby="wizard-step-title">
        {step === 1 && (
          <fieldset>
            <legend id="wizard-step-title">Vergangenes Semester wählen</legend>
            <p className="field-help">
              Gib das Fachsemester an, in dem du das Modul tatsächlich belegt
              hast. Laut Studienplan wird es für Fachsemester{' '}
              {item.recommendedSemester} empfohlen.
            </p>
            <label className="semester-input">
              <span>Tatsächliches Fachsemester</span>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={semester}
                aria-invalid={semester !== '' && !isPositiveInteger(semester)}
                onChange={(event) => {
                  setSemester(event.target.value);
                  if (!componentSemesterWasEdited) {
                    setComponentSemester(event.target.value);
                  }
                }}
                placeholder="z. B. 2"
              />
            </label>
            {semester !== '' && !isPositiveInteger(semester) && (
              <p className="critical-note" role="alert">
                Das Fachsemester muss eine positive ganze Zahl sein.
              </p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend id="wizard-step-title">Module gesammelt markieren</legend>
            <p className="field-help">
              Wähle die Module, zu denen dein offizieller Verlauf Angaben
              enthält.
            </p>
            <label className="choice-card module-choice">
              <input
                type="checkbox"
                checked={selected}
                onChange={(event) => setSelected(event.target.checked)}
              />
              <span>
                <strong>{item.title.de}</strong>
                <small>
                  {item.officialCode} · {item.creditsHundredths / 100} ECTS
                </small>
              </span>
            </label>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend id="wizard-step-title">
              Offiziellen Modulstatus setzen
            </legend>
            <p className="field-help">
              Entscheidend ist der Status des Moduls, nicht die Summe einzelner
              Prüfungsbestandteile.
            </p>
            <div className="status-options">
              {statusOptions.map((option) => (
                <label className="status-choice" key={option.code}>
                  <input
                    type="radio"
                    name="official-status"
                    value={option.code}
                    checked={status === option.code}
                    onChange={() => setStatus(option.code)}
                  />
                  <span className="status-code">{option.code}</span>
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.help}</small>
                  </span>
                </label>
              ))}
            </div>
            {status === 'EN' && (
              <div className="critical-note" role="alert">
                <strong>Bitte sofort offiziell klären.</strong>
                <p>
                  Currivia berechnet aus EN keinen Studienabbruch und schlägt
                  keinen weiteren Versuch vor. Wende dich an das Prüfungsamt
                  oder die zuständige Studienberatung.
                </p>
              </div>
            )}
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend id="wizard-step-title">Optionale offizielle Details</legend>
            <p className="field-help">
              Lass Felder leer, wenn sie in deiner Übersicht nicht ausgewiesen
              sind.
            </p>
            <div className="detail-grid">
              <label>
                <span>Note</span>
                <select
                  value={grade}
                  onChange={(event) => setGrade(event.target.value)}
                >
                  <option value="">Nicht erfasst</option>
                  {config.gradingScale.allowedHundredths.map((value) => (
                    <option key={value} value={value}>
                      {formatGrade(value)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Offizielle Versuchszahl</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={attempt}
                  aria-invalid={!attemptIsValid}
                  onChange={(event) => setAttempt(event.target.value)}
                  placeholder="Nicht erfasst"
                />
              </label>
            </div>
            {!attemptIsValid && (
              <p className="critical-note" role="alert">
                Die offizielle Versuchszahl muss eine positive ganze Zahl sein.
              </p>
            )}
            <p className="interpretation-note">
              Eine Versuchszahl wird exakt übernommen und niemals aus früheren
              Status berechnet.
            </p>
          </fieldset>
        )}

        {step === 5 && (
          <div>
            <h2 id="wizard-step-title">Prüfungsbestandteile und Abschluss</h2>
            <label className="component-toggle">
              <input
                type="checkbox"
                checked={includeComponent}
                onChange={(event) => setIncludeComponent(event.target.checked)}
              />
              <span>
                <strong>{item.assessment.title.de} detaillieren</strong>
                <small>
                  Optional – der offizielle Modulstatus bleibt maßgeblich.
                </small>
              </span>
            </label>
            {includeComponent && (
              <div className="component-fields">
                <label>
                  <span>Status des Bestandteils</span>
                  <select
                    value={componentStatus}
                    onChange={(event) =>
                      setComponentStatus(event.target.value as OfficialStatus)
                    }
                  >
                    <option value="">Bitte auswählen</option>
                    {statusOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label} ({option.code})
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Fachsemester der Aktivität</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={componentSemester}
                    aria-invalid={!isPositiveInteger(componentSemester)}
                    onChange={(event) => {
                      setComponentSemesterWasEdited(true);
                      setComponentSemester(event.target.value);
                    }}
                  />
                </label>
                <label>
                  <span>Offizielle Versuchszahl des Bestandteils</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={componentAttempt}
                    aria-invalid={!isOptionalPositiveInteger(componentAttempt)}
                    onChange={(event) =>
                      setComponentAttempt(event.target.value)
                    }
                    placeholder="Nicht erfasst"
                  />
                </label>
              </div>
            )}
            {!componentFieldsAreValid && (
              <p className="critical-note" role="alert">
                Semester und Versuchszahl müssen positive ganze Zahlen sein.
              </p>
            )}
            <dl className="review-ledger">
              <div>
                <dt>Modul</dt>
                <dd>{item.title.de}</dd>
              </div>
              <div>
                <dt>Fachsemester</dt>
                <dd>{semester}</dd>
              </div>
              <div>
                <dt>Modulstatus</dt>
                <dd>{status || 'Nicht gewählt'}</dd>
              </div>
              <div>
                <dt>Note</dt>
                <dd>{grade ? formatGrade(Number(grade)) : 'Nicht erfasst'}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="wizard-actions">
          {step > 1 ? (
            <button
              className="secondary-button"
              type="button"
              onClick={() => setStep(step - 1)}
            >
              Zurück
            </button>
          ) : (
            <span />
          )}
          {step < 5 ? (
            <button
              className="primary-button compact"
              type="button"
              disabled={!canContinue}
              onClick={() => setStep(step + 1)}
            >
              Weiter
            </button>
          ) : (
            <button
              className="primary-button compact"
              type="button"
              disabled={!canFinish || finishRequested}
              onClick={finish}
            >
              {finishRequested
                ? 'Wird lokal gespeichert …'
                : 'Verlauf lokal speichern'}
            </button>
          )}
        </div>
        {saveState === 'error' && !finishRequested && (
          <p className="critical-note" role="alert">
            Der Verlauf konnte nicht lokal gespeichert werden. Bitte versuche es
            erneut.
          </p>
        )}
      </section>
    </div>
  );
}
