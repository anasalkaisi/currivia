import { useState } from 'react';
import type { CurriculumConfig } from '@currivia/schema';

import { content } from '../content';
import { usePlan } from '../plan/usePlan';
import { navigate } from '../routes';

type Enrollment = 'sose-2025' | 'wise-2024-25';

/**
 * Configures the study planner for the user's enrollment period and regulation version.
 *
 * @param config - Curriculum and regulation data used to determine supported enrollment periods and source information
 * @returns The onboarding interface for selecting and confirming the applicable regulation
 */
export function Onboarding({ config }: { config: CurriculumConfig }) {
  const { createPlan, plan } = usePlan();
  const [enrollment, setEnrollment] = useState<Enrollment>('sose-2025');
  const [confirmed, setConfirmed] = useState(false);
  const isSupported = enrollment === config.applicability.enrollmentFrom;
  const sourceItemId = config.curriculumItems[0]?.id;

  const openPlan = () => {
    if (!confirmed || !isSupported) return;
    if (!plan) createPlan();
    navigate('/planner');
  };

  return (
    <div className="onboarding-layout">
      <section className="intro-panel" aria-labelledby="onboarding-title">
        <div className="eyebrow">S3 · Lokaler Entwicklungsstand</div>
        <h1 id="onboarding-title">Deine SPO. Nachvollziehbar belegt.</h1>
        <p className="intro-copy">
          Erfasse offizielle Modulstatus und optionale Verlaufsdetails lokal,
          ohne automatische Rechtsauslegung.
        </p>
        <dl className="trust-list">
          <div>
            <dt>Speicherung</dt>
            <dd>Nur in diesem Browser</dd>
          </div>
          <div>
            <dt>Datenumfang</dt>
            <dd>Keine Namen oder Matrikelnummern; Noten nur optional</dd>
          </div>
          <div>
            <dt>Regelstatus</dt>
            <dd>Selbst geprüft, noch nicht zweitgeprüft</dd>
          </div>
        </dl>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="folio" aria-hidden="true">
          01
        </div>
        <p className="section-kicker">Regelgeneration bestätigen</p>
        <h2 id="setup-title">Planner einrichten</h2>

        <div className="fixed-field">
          <span>Studiengang</span>
          <strong>Medieninformatik, Bachelor</strong>
        </div>

        <label className="field-label" htmlFor="enrollment">
          Erstmalige Einschreibung
        </label>
        <select
          id="enrollment"
          value={enrollment}
          onChange={(event) => {
            setEnrollment(event.target.value as Enrollment);
            setConfirmed(false);
          }}
        >
          <option value="sose-2025">Sommersemester 2025</option>
          <option value="wise-2024-25">Wintersemester 2024/25</option>
        </select>

        <div
          className={`proposal ${isSupported ? '' : 'proposal-unsupported'}`}
        >
          <span>Vorgeschlagene SPO</span>
          <strong>
            {isSupported ? config.regulationVersion : 'nicht unterstützt'}
          </strong>
          <a href={`#/sources/${sourceItemId}`}>
            Quelle und Geltungsbereich anzeigen
          </a>
        </div>

        {!isSupported && (
          <p className="scope-message" role="alert">
            {content.unsupported}
          </p>
        )}

        <label className="confirmation">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={!isSupported}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>
            Ich habe die SPO-Version in meinen offiziellen Unterlagen geprüft.
          </span>
        </label>

        <button
          className="primary-button"
          type="button"
          disabled={!confirmed || !isSupported}
          onClick={openPlan}
        >
          Plan öffnen
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  );
}
