# Currivia: AI-native Delivery-Plan

**Stand:** 19. August 2026
**Phase:** S2 in Review
**Scope:** `v0.1.0-alpha.x`
**Produktvertrag:** [mvp-specification.de.md](./mvp-specification.de.md)

## 1. Zweck und Dokumentgrenzen

Dieses Dokument beschreibt, wie die eingefrorene MVP-Spezifikation umgesetzt wird. Es trennt drei Planungsebenen:

| Ebene                | Zweck                                                            | Ablage                        | Lebensdauer                      |
| -------------------- | ---------------------------------------------------------------- | ----------------------------- | -------------------------------- |
| Produktspezifikation | Was und warum gebaut wird; fachliche Invarianten                 | `mvp-specification.de.md`     | dauerhaft                        |
| Delivery-Plan        | Slice-Reihenfolge, Abdeckung, Workflow und Qualitätsgates        | diese Datei                   | bis zum MVP, danach als Historie |
| Ausführung           | nächster konkreter Slice, Akzeptanzkriterien und aktuelle Arbeit | GitHub-Issue und Pull Request | bis Abschluss des Slices         |

Die MVP-Spezifikation wird nicht als Taskliste verwendet. GitHub-Issues enthalten keine neuen Produktentscheidungen. Entsteht während eines Slices eine echte Produkt- oder Architekturentscheidung, wird zuerst das passende dauerhafte Dokument oder ein ADR aktualisiert.

## 2. Aktueller Workflow-Stand

Abgeschlossen:

- Machbarkeit und Produktgrenzen
- Brainstorming
- Shared Understanding durch strukturiertes Interview
- Scope Freeze
- verbindliche MVP-Spezifikation
- schlankes Specification Gate
- grobe Slice Map für den gesamten MVP
- S1 vollständig implementiert und technisch verifiziert
- S2 detailliert, implementiert und technisch verifiziert
- S1 über Pull Request #2 gemergt
- S2-Recap, Issue #3 und Review-Branch

Als Nächstes:

1. S2 fachlich und visuell menschlich abnehmen
2. unabhängige Zweitprüfung der verwendeten offiziellen Quellen abschließen
3. S2-Draft-PR prüfen und Review abschließen
4. S2 mergen und erst danach S3 detaillieren

## 3. Arbeitsprinzip

Ein vertikaler Slice liefert einen prüfbaren Nutzerwert durch alle dafür erforderlichen Schichten. Er ist nicht bloß eine technische Komponente.

Guter Slice:

> Ein Student bestätigt seine SPO, markiert ein offizielles Modul als bestanden, sieht die ECTS-Auswirkung und findet den Zustand nach dem Neuladen wieder.

Schlechter horizontaler Task:

> Die gesamte Regel-Engine implementieren.

Der schlechte Task liefert lange keinen nutzbaren Weg, lädt zu spekulativen Abstraktionen ein und verschiebt Integrationsfehler nach hinten.

## 4. Slice Map des MVP

Die Slice Map deckt den gesamten MVP grob ab. Nur der unmittelbar nächste Slice wird implementierungsreif detailliert. Reihenfolge und Zuschnitt dürfen nach einem Recap angepasst werden, solange die MVP-Abdeckung erhalten bleibt und der Scope nicht wächst.

### Planungshorizont

Currivia verwendet Rolling-Wave-Planning mit drei Schärfegraden:

| Horizont           | Planungsgrad                                                              | Zweck                                                                |
| ------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| gesamter MVP       | grobe Slice Map S1–S7 und Release-Gate R1                                 | Abdeckung, Reihenfolge und Scope sichtbar halten                     |
| nächster Slice     | vollständige Spezifikation, Quellen, UI-Weg, Akzeptanzkriterien und Tests | sichere Implementierung ohne wesentliche offene Annahme              |
| übernächster Slice | höchstens kurze Notizen zu Abhängigkeiten oder bekannten Risiken          | Anschlussfähigkeit sichern, ohne spekulative Details festzuschreiben |

Nach jedem abgeschlossenen Slice werden MVP-Spezifikation und Slice Map kurz auf neue Erkenntnisse geprüft. Erst dann wird der folgende Slice detailliert. Spätere Slices werden nicht vorab zu einem großen Bestand scheinbar fertiger Tickets ausformuliert.

### S1 – Quellenbelegter ECTS-Walking-Skeleton

**Nutzerergebnis**

Ein Student kann `mi7-sose2025` bestätigen, ein echtes quellenbelegtes Modul im vorgesehenen Semester sehen, es als bestanden markieren, die ECTS-Auswirkung erkennen und den Zustand nach einem Neuladen wiederfinden.

**Durchstochene Schichten**

- minimale React-/Vite-Anwendung
- Hash-Routing
- minimale Curriculums-Konfiguration
- Zod-Schema für Konfiguration und persönlichen Zustand
- interne stabile Modul-ID
- offizieller Status `BE`
- minimale `sumCredits`-Auswertung
- IndexedDB-Repository über `idb`
- Autosave und Ladepfad
- sichtbare Quellenreferenz
- Tastaturbedienung
- Vitest und ein kritischer Playwright-Weg
- minimale CI und deploybarer Build

**Bewusst noch nicht enthalten**

- vollständiger Modulkatalog
- alle Status und Versuche
- vollständige Anforderungsgruppen
- Wahlpflichtlogik
- Import und Export

### S2 – Bestehenden Studienverlauf korrekt erfassen

**Nutzerergebnis**

Ein Student kann vergangene Semester zügig erfassen und die offiziellen SELMA-Status samt Prüfungsbestandteilen korrekt abbilden.

**Enthalten**

- geführter Erfassungsassistent
- `AN`, `BE`, `NB`, `EN`, `RT`
- separater offizieller Modulstatus
- Prüfungsbestandteile
- optionale offizielle Versuchszahl
- semesterübergreifende Aktivitäten
- optionale, validierte Noten
- `nicht prüfbar` bei fehlenden Daten
- synthetische Testfälle für alle Status
- Warnung und offizieller Klärungshinweis bei `EN`

### S3 – Semester planen und Prognose verstehen

**Nutzerergebnis**

Ein Student kann Module zwischen Semestern verschieben und klar zwischen bestandenem Ist-Zustand und einer „Wenn alles bestanden wird“-Prognose unterscheiden.

**Enthalten**

- sieben initiale Fachsemester
- Kalender- und Fachsemesterzuordnung
- Urlaubs- und Unterbrechungssemester
- Desktop-Fokus auf drei Semester
- mobile Einzelansicht
- Verschieben per Tastatur und optional Drag-and-drop
- „noch nicht eingeplant“
- Wahlpflichtmodul mit unbestätigter Verfügbarkeit planen
- persönliche Verfügbarkeitsnotiz
- Ist-/Prognose-Trennung
- Relevanz statt Warnungsflut
- lokales Rückgängig für riskante Einzelaktionen

### S4 – Voraussetzungen anhand eines echten kritischen Wegs prüfen

**Nutzerergebnis**

Ein Student plant ein Praxissemester und versteht, ob die belegte 70-ECTS-Voraussetzung vor dem relevanten Semester tatsächlich erfüllt oder nur prognostiziert ist.

**Enthalten**

- strukturierte Regelergebnisse
- `satisfied`, `unsatisfied`, `unknown`, `notApplicable`
- stichtagsbezogene Auswertung
- `mustPassBefore`
- Praxissemester als eigener Curriculumsbaustein
- Hinweisstufen Handlungsbedarf, Planungsrisiko und Information
- Inline-Hinweis und zentrale Prüfansicht aus demselben Ergebnis
- Quellenfundstelle und Datenstand
- technische Fehlerisolation einer einzelnen Regel

### S5 – Vollständigen Mindestfortschritt und Wahlpflicht abbilden

**Nutzerergebnis**

Ein Student kann alle garantierten MVP-Anforderungen getrennt nachvollziehen und Wahlpflichtentscheidungen planen, ohne Doppelanrechnung zu übersehen.

**Enthalten**

- 210 ECTS gesamt
- 60 ECTS Grundstudium
- 87 ECTS Pflicht-Hauptstudium
- 63 ECTS Wahlpflicht
- 45 zulässige MI-/Mobile-Medien-ECTS
- Zwischenprüfung
- Bachelorarbeitsvoraussetzungen
- hierarchische Anrechnung
- Schutz vor unbeabsichtigter Doppelanrechnung
- mehrdeutige geplante Zuordnung
- persönliche offizielle Zuordnung mit Provenienz
- `maxSelections`, `mustTakeTogether`, `mutuallyExclusive`, soweit belegt
- Fortschrittsansicht nach Anforderungsgruppen
- sichtbare Liste „noch nicht geprüft“

### S6 – Persönliche Daten sicher verwalten

**Nutzerergebnis**

Ein Student kann seinen Plan sichern, vollständig wiederherstellen und kontrolliert löschen, ohne dass ungültige oder konkurrierende Daten still verloren gehen.

**Enthalten**

- JSON-Export mit Versionsmetadaten
- vollständiger Importersatz mit Vorschau
- Größen- und Plausibilitätsgrenzen
- schrittweise Migration
- letzter gültiger Snapshot
- sichere Wiederherstellung
- Rohdatenexport bei Fehlern
- zweistufige Gesamtlöschung
- Sicherungserinnerung
- `BroadcastChannel` und Mehrtab-Konfliktbehandlung
- archivierte Modulreferenzen ohne stilles Löschen

### S7 – Vertrauenswürdige öffentliche Alpha

**Nutzerergebnis**

Ein berechtigter Student kann die Alpha mit klaren Grenzen nutzen; ein nicht berechtigter Besucher kann einen synthetischen Demo-Verlauf ansehen, ohne eine persönliche Regelaussage zu erhalten.

**Enthalten**

- Demo-Modus
- Status der Konfiguration und einzelner Regeln
- `regulationVersion` und `sourceRevision`
- Änderungsnachweis bei neuer Quellenrevision
- veraltete oder archivierte Konfiguration
- Glossar und kontextbezogene Erklärungen
- Datenschutz-, Hosting- und Projektinformationen
- Feedback- und Diagnoseweg ohne persönliche Daten
- Release-Hinweise und bekannte Grenzen
- `noindex` während des Piloten
- vollständiger Browser- und Accessibility-Abschlusscheck
- GitHub-Pages-Release aus einem Versionstag

### R1 – Pilot und Stabilisierung

Der Pilot ist kein Feature-Slice, sondern das Release-Gate nach S7.

Enthalten:

- zwei moderierte Sitzungen
- fünf unmoderierte Sitzungen
- Messung aller Go/No-Go-Kriterien
- Behebung ausschließlich releasekritischer Probleme
- Regressionstests
- aggregierter Pilotbericht
- nächster `v0.1.0-alpha.x`-Release oder begründetes No-Go

## 5. Querschnittsanforderungen

Folgende Themen werden nicht auf einen letzten „Quality Slice“ verschoben. Jeder Slice erfüllt sie proportional zu seinem Umfang:

- offizielle Quellen und Provenienz
- Schema- und Eingabevalidierung
- Datenschutz und Datenminimierung
- Tastaturbedienung und semantische Struktur
- verständliche Fehlerzustände
- Unit-, Integrations- und End-to-End-Verifikation
- keine unnötige Abhängigkeit
- keine ungefragte Scope-Erweiterung
- Aktualisierung betroffener Dokumentation

S7 führt nur die abschließende Gesamthärtung und die noch fehlenden öffentlichen Oberflächen durch.

## 6. Kanban-Modell

Für ein Solo-Projekt genügt ein kleines GitHub Project mit fünf Spalten:

1. **Backlog** – grundsätzlich im MVP oder als späterer Kandidat erfasst
2. **Ready** – fachlich geklärt, klein genug, Akzeptanz- und Testkriterien vorhanden
3. **In Progress** – genau ein Feature-Slice gleichzeitig
4. **Review** – Implementierung fertig, CI grün, menschliche Abnahme und Recap offen
5. **Done** – Definition of Done erfüllt und Pull Request gemergt

`Blocked` ist ein Label beziehungsweise sichtbarer Statusgrund, keine dauerhafte Ablage für ungeklärte Arbeit.

### WIP-Limit

Für Feature-Slices gilt:

```text
In Progress ≤ 1
Review ≤ 1
```

Ein Bugfix darf parallel laufen, wenn er den aktiven Slice blockiert und im selben Pull Request bleibt. Neue Features werden nicht parallel begonnen.

## 7. Was wird ein GitHub-Issue?

Ein GitHub-Issue repräsentiert standardmäßig einen vertikalen Slice mit einem demonstrierbaren Nutzerergebnis.

Ein Issue ist nicht automatisch nötig für:

- jede Datei
- jede Komponente
- jedes Schemafeld
- einzelne Tests
- kleine Refactor-Schritte innerhalb des aktiven Slices

Diese Punkte stehen als Checkliste im Slice-Issue.

Ein separates Issue ist nur sinnvoll, wenn die Arbeit:

- unabhängig abnehmbar ist,
- einen eigenen Nutzer- oder Qualitätswert liefert,
- den Slice nicht horizontal zerreißt und
- in einem eigenen kleinen Pull Request landen kann.

Beispiele ungeeigneter, horizontaler Feature-Issues:

- „IndexedDB implementieren“
- „Regel-Engine bauen“
- „alle UI-Komponenten anlegen“
- „Accessibility später ergänzen“

Diese Arbeiten gehören jeweils in den Slice, der sie erstmals benötigt.

## 8. Struktur eines Slice-Issues

Jedes Slice-Issue verwendet folgende Struktur:

```markdown
# Nutzerergebnis

Als <Zielnutzer> kann ich <vollständiger Weg>, damit <beobachtbarer Nutzen>.

## Warum jetzt?

Welches Risiko oder welcher Wert wird mit diesem Slice zuerst validiert?

## In Scope

- ...

## Nicht in Scope

- ...

## Quellen und Entscheidungen

- offizielle Fundstellen
- relevante Abschnitte der MVP-Spezifikation
- relevante ADRs

## Akzeptanzkriterien

- [ ] beobachtbares Verhalten ...
- [ ] Fehler- und Unbekannt-Zustand ...
- [ ] Tastaturweg ...
- [ ] Daten bleiben nach Neuladen erhalten ...

## Test- und Verifikationsplan

- Unit ...
- Integration ...
- Browserweg ...
- manuelle Human-in-the-loop-Prüfung ...

## Technische Berührungspunkte

- Schema
- Domäne/Regeln
- Persistenz
- UI
- Dokumentation

## Definition of Done

- [ ] CI grün
- [ ] Quellen geprüft
- [ ] Akzeptanzkriterien manuell abgenommen
- [ ] keine unbeteiligten Dateien geändert
- [ ] Recap durchgeführt
- [ ] kleinster sinnvoller Refactor geprüft
- [ ] PR gemergt
```

## 9. Ready-Gate eines Slices

Ein Issue darf erst nach `Ready`, wenn:

- das Nutzerergebnis in einem Satz erklärbar ist,
- In Scope und Nicht in Scope feststehen,
- alle fachlichen Aussagen quellenbelegt oder ausdrücklich synthetisch sind,
- keine offene Entscheidung die Implementierung wesentlich verändern könnte,
- der Slice höchstens ein bis zwei konzentrierte Arbeitstage umfasst,
- Akzeptanzkriterien von außen beobachtbar sind,
- ein echter Test- und Verifikationsplan vorliegt,
- der UI-Weg grob skizziert ist und
- Abhängigkeiten zu vorherigen Slices eindeutig sind.

Ist ein Punkt nicht erfüllt, wird nicht „mit einer Annahme losgebaut“. Das Issue bleibt im Backlog oder erhält einen kleinen zeitlich begrenzten Research-/Spike-Task.

## 10. Definition of Done eines Slices

Ein Slice ist nur `Done`, wenn:

- das zugesagte Nutzerergebnis vollständig funktioniert,
- alle Akzeptanzkriterien erfüllt sind,
- Unit-, Integrations- und Browsertests grün sind,
- der relevante Tastaturweg manuell geprüft wurde,
- Regel- und Quellenangaben menschlich gegen die Originalquelle geprüft wurden,
- persönliche Daten weder in Logs noch Fixtures gelangt sind,
- keine bekannte kritische Regression besteht,
- der Diff klein und thematisch geschlossen ist,
- erforderliche ADRs oder dauerhafte Dokumente aktualisiert sind,
- ein Recap festhält, was tatsächlich gebaut und gelernt wurde,
- ein gezielter Refactor geprüft wurde und
- der Pull Request nachvollziehbar gemergt werden kann.

## 11. Human-in-the-loop-Verantwortung

Die AI darf:

- Optionen und Slice-Zuschnitte vorschlagen
- Implementierungspläne und Tests entwerfen
- Code und Dokumentation erstellen
- lokale Tests und Browserwege ausführen
- Diffs erklären
- Refactoring-Kandidaten identifizieren

Der Mensch entscheidet und bestätigt:

- Produktumfang und Priorität
- Interpretation offizieller Quellen
- fachliches Daten- und Regelmodell
- sicherheits- und datenschutzrelevante Trade-offs
- sichtbares UX-Verhalten
- Akzeptanzkriterien
- tatsächliche Abnahme
- Merge und Release

Eine AI-Bewertung ersetzt keine fachliche Zweitprüfung einer Studienregel.

## 12. AI-native Ablauf pro Slice

### 12.1 Planen

1. Frischen Kontext beginnen.
2. Nur MVP-Spezifikation, Delivery-Plan, relevante ADRs und Quellen laden.
3. Nächsten Slice auswählen.
4. Offene Fragen vor der Implementierung klären.
5. Issue mit Akzeptanz- und Testkriterien auf `Ready` setzen.

### 12.2 Implementieren

1. Kleinen Branch und Pull Request verwenden.
2. Einen fehlschlagenden oder überprüfbaren Testpfad zuerst festlegen.
3. Nur Code für den aktuellen Slice verändern.
4. Regelmäßig Build, Typen und fokussierte Tests ausführen.
5. Kontext wechseln, bevor die Sitzung unübersichtlich wird; den Zustand knapp über das Issue übergeben.

### 12.3 Verifizieren

1. CI vollständig ausführen.
2. Kritischen Nutzerweg in einem echten Browser testen.
3. Fehler- und Unbekannt-Zustände prüfen.
4. Tastaturweg prüfen.
5. Quellen und sichtbare Aussagen manuell vergleichen.
6. Unbeteiligte Diff-Änderungen zurückweisen.

### 12.4 Recap und Refactor

1. In eigenen Worten erklären, wie der Slice jetzt funktioniert.
2. Abweichungen vom Plan sichtbar machen.
3. Kleinsten Refactor bestimmen, der Verständlichkeit messbar verbessert.
4. Verhalten unverändert halten und Tests erneut ausführen.
5. Dauerhafte Erkenntnisse in Spezifikation, ADR oder Quellendaten übernehmen.

### 12.5 Abschließen

1. Temporäre Prompt- und Scratch-Artefakte entfernen.
2. Dauerhafte Spezifikationen, ADRs und Quellenbelege behalten.
3. Atomaren, verständlichen Commit beziehungsweise kleinen PR abschließen.
4. Issue auf `Done` setzen.
5. Erst danach den nächsten Slice detaillieren.

## 13. Umgang mit Spikes

Ein Spike ist erlaubt, wenn eine konkrete Unsicherheit nicht seriös durch Lesen oder Diskussion aufgelöst werden kann.

Beispiele:

- Kann die deklarative DSL alle fünf repräsentativen Regeltypen ausdrücken?
- Funktioniert die geplante IndexedDB-Migration in den Zielbrowsern?
- Lässt sich eine barrierefreie Verschiebeinteraktion mit der gewählten Headless-Bibliothek umsetzen?

Regeln:

- klare Frage und Zeitlimit, normalerweise höchstens zwei Stunden
- kein Anspruch auf Produktionsqualität
- kein stilles Übernehmen des Spike-Codes
- Ergebnis als Entscheidung, Test oder ADR dokumentieren
- Spike-Code wird verworfen oder in einem eigenen Review bewusst neu implementiert

## 14. Backlog- und Ticketgranularität

Das Backlog enthält drei Arten von Arbeit:

| Typ           | Bedeutung                                          | Beispiel                                  |
| ------------- | -------------------------------------------------- | ----------------------------------------- |
| Feature Slice | vertikaler Nutzerwert                              | S3 Semester planen und Prognose verstehen |
| Bug           | beobachtbare Abweichung von vereinbartem Verhalten | `RT` wird fälschlich als `NB` gezählt     |
| Enabler/Spike | kleine notwendige Unsicherheitsreduktion           | DSL-Probe für Kopplungsregel              |

Technische Schulden werden nur als eigenes Issue erfasst, wenn:

- eine konkrete Auswirkung benannt ist,
- eine gewünschte Zielstruktur beschrieben ist und
- die Änderung klein und verifizierbar bleibt.

Ein unspezifisches Ticket „Code aufräumen“ ist nicht zulässig.

## 15. Priorisierung

Innerhalb des MVP gilt:

1. fachliche Korrektheit und Quellen
2. Datenintegrität und sichere Fehlerzustände
3. vollständiger Kernweg
4. Accessibility und Verständlichkeit
5. Pilotierbarkeit
6. Komfort und visuelle Verfeinerung

Kennzeichnungen:

- `P0` – blockiert korrekte oder sichere Nutzung
- `P1` – erforderlich für aktuellen Slice oder MVP-Go/No-Go
- `P2` – sinnvoll, aber nach dem aktiven Slice planbar
- `post-mvp` – explizit außerhalb des Scope Freeze

Priorität allein zieht kein Issue nach `Ready`. Das Ready-Gate bleibt verbindlich.

## 16. Professioneller Nachweis für Hochschule und Portfolio

Die sichtbare Projektqualität entsteht nicht durch möglichst viele Dokumente oder AI-generierten Text, sondern durch eine geschlossene Beweiskette:

```text
offizielle Quelle
    → dokumentierte Produkt-/Architekturentscheidung
    → kleines Slice-Issue mit Akzeptanzkriterien
    → fokussierter Pull Request
    → automatisierte Tests und manuelle Abnahme
    → nachvollziehbarer Release
    → aggregiertes Pilotfeedback
```

Das Repository soll deshalb zeigen:

- warum eine Regel existiert
- wie sie getestet wurde
- welche menschliche Prüfung stattfand
- welcher kleine Nutzerweg sie erstmals nutzbar machte
- welche Grenzen weiterhin bekannt sind

## 17. Nächste konkrete Aktion

S2 ist implementiert und technisch verifiziert. Die nächste Arbeitssitzung:

1. liest den kompakten [Projektstatus](./current-state.de.md), die [S2-Spezifikation](../slices/s2-study-history.de.md) und den [S2-Recap](../slices/s2-recap.de.md),
2. prüft Statussemantik, S1→S2-Migration und den vollständigen Erfassungsweg,
3. führt die menschliche fachliche und visuelle Abnahme durch,
4. prüft den S2-Draft-PR gegen den gemergten S1-Stand und
5. beginnt erst nach abgeschlossenem S2-Review mit der Detailplanung von S3.
