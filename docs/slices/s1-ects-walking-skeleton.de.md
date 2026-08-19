# S1: Quellenbelegter ECTS-Walking-Skeleton

**Status:** Review – implementiert, Quellen-Zweitprüfung offen
**Stand:** 19. August 2026
**Ziel:** erster vertikaler Produktweg
**Öffentliche Freigabe:** nein

## 1. Nutzerergebnis

> Als Medieninformatik-Student der Regelgeneration `mi7-sose2025` kann ich meine SPO bestätigen, das quellenbelegte Modul Web Development im ersten Semester sehen, es als bestanden markieren, die ECTS-Auswirkung erkennen und denselben Zustand nach dem Neuladen wiederfinden.

## 2. Warum dieser Slice zuerst kommt

S1 prüft die wichtigsten Architekturgrenzen mit dem kleinsten fachlich echten Weg:

- versionierte offizielle Quelle
- validierte Curriculumskonfiguration
- stabile Modulidentität
- getrennte persönliche Daten
- minimale deterministische Regel
- lokale Persistenz
- UI, Accessibility und Browser-Verifikation

Der Slice verhindert, dass Engine, Planner und Persistenz zunächst getrennt und spekulativ entstehen.

## 3. Quellen

Verbindliches Paket:

- [Quellenpaket S1](../sources/hdm-mi7-sose2025-s1.de.md)

Belegte Fakten:

- `mi7-sose2025` gilt für Einschreibungen ab SoSe 2025.
- Der Bachelor umfasst 210 ECTS.
- `113114 Web Development` ist ein Pflichtmodul des Grundstudiums.
- Es ist für Semester 1 vorgesehen und umfasst 5 ECTS.
- Laut archiviertem Modulhandbuch bestehen keine formalen Modulvoraussetzungen.

## 4. In Scope

- lokale Landingpage für den S1-Entwicklungsstand
- fest unterstützter Studiengang Medieninformatik
- Eingabe beziehungsweise Auswahl des Einschreibesemesters
- Vorschlag `mi7-sose2025`
- ausdrückliche Bestätigung der Prüfungsordnung
- erste Planner-Ansicht mit Semester 1
- genau ein offizielles Modul: `hdm-mi7-113114`
- Status „offen“ als fehlender Abschlussdatensatz
- Aktion „als bestanden markieren“ mit offiziellem Status `BE`
- Aktion zum Zurücksetzen auf „offen“
- Anzeige `0/210 ECTS` beziehungsweise `5/210 ECTS`
- sichtbare SPO-, Quellen- und Revisionsangabe
- Autosave in IndexedDB
- Wiederherstellung nach Neuladen
- Tastaturbedienung für den vollständigen Weg
- fokussierte Unit-, Integrations- und Playwright-Tests
- minimaler CI-fähiger Produktionsbuild

## 5. Nicht in Scope

- öffentlich nutzbare Alpha
- vollständiger Modulkatalog
- weitere offizielle Status außer `BE`
- Versuche oder Prüfungsbestandteile
- Wahlpflicht- und Bereichssummen
- Prognose
- Modulverschiebung
- Import, Export und Migration
- mehrere Tabs
- Demo-Modus
- durchschnittliche Noten
- vollständiges Designsystem

## 6. Schutz gegen falsche Vollständigkeit

S1 verwendet echte Daten, aber ein absichtlich unvollständiges Curriculum. Jede Planner-Ansicht zeigt deshalb dauerhaft:

> Entwicklungs-Slice: Der Curriculumsdatensatz enthält derzeit nur ein Modul und darf nicht für Studienentscheidungen verwendet werden.

Der Build wird nicht als öffentliche Alpha veröffentlicht und erhält keine Aussage wie „Konfiguration vollständig“ oder `verified`.

## 7. UI-Weg

### Schritt 1: Einstieg

```text
┌────────────────────────────────────────────────────┐
│ Currivia                                           │
│ Lokaler Studienverlaufsplaner                      │
│                                                    │
│ Studiengang: Medieninformatik (fest)               │
│ Einschreibung: [ SoSe 2025 ]                       │
│                                                    │
│ Vorgeschlagene SPO: mi7-sose2025                   │
│ Quelle und Geltungsbereich anzeigen                │
│                                                    │
│ [ ] Ich habe meine SPO-Version geprüft.            │
│                                                    │
│                         [Plan öffnen]               │
└────────────────────────────────────────────────────┘
```

`Plan öffnen` bleibt deaktiviert, bis die Bestätigung gesetzt wurde. Außerhalb des unterstützten Geltungsbereichs wird kein echter Planner geöffnet.

### Schritt 2: Minimaler Planner

```text
┌────────────────────────────────────────────────────┐
│ Entwicklungs-Slice: Curriculum unvollständig       │
│                                                    │
│ Fortschritt                         0 / 210 ECTS    │
│                                                    │
│ 1. Fachsemester                                   │
│ ┌────────────────────────────────────────────────┐ │
│ │ Web Development                     5 ECTS     │ │
│ │ Pflicht · Grundstudium · SPO S. 70             │ │
│ │ Status: Offen                                  │ │
│ │ [Als bestanden markieren]  [Quelle anzeigen]  │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ SPO: mi7-sose2025 · Quelle: hdm-sose2025-initial  │
└────────────────────────────────────────────────────┘
```

Nach „Als bestanden markieren“ zeigt die Karte `Bestanden (BE)` und der Fortschritt `5 / 210 ECTS`.

## 8. Minimaler Datenvertrag

Die endgültige Zod-Syntax entsteht im Slice. Folgende Semantik ist verbindlich.

### Offizielle Konfiguration

- `regulationVersion = mi7-sose2025`
- `sourceRevision = hdm-sose2025-initial`
- `completeness = incomplete-development-slice`
- Quellenregister mit Q-SPO-2025 und Q-MHB-2025
- Modul `hdm-mi7-113114`
- offizieller Code `113114`
- 500 Hundertstel-ECTS
- empfohlenes Fachsemester 1
- Bereich `basic-compulsory`
- Requirement `total-credits` mit Ziel 21.000 Hundertstel-ECTS

### Persönlicher Zustand

- `schemaVersion = 1`
- bestätigte `regulationVersion`
- Einschreibesemester
- Zeitstempel der Bestätigung
- optionaler Abschlussdatensatz für `hdm-mi7-113114`
- offizieller Status dieses Datensatzes ausschließlich `BE`

Der persönliche Zustand dupliziert weder Modultitel noch ECTS oder Regeln.

## 9. Regelverhalten

S1 implementiert genau einen fachlichen Operator:

```text
sumCredits(status = BE)
```

Verhalten:

| Zustand                                 | Istwert                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------- |
| kein Abschlussdatensatz                 | 0 ECTS                                                                      |
| Web Development mit `BE`                | 5 ECTS                                                                      |
| ungültige oder unbekannte Modulreferenz | Konfiguration beziehungsweise Zustand wird abgelehnt; kein stiller Teilwert |

Die Regel liefert einen strukturierten Istwert und Zielwert. Sie erzeugt keinen fertigen deutschen UI-Text.

## 10. Akzeptanzkriterien

- [ ] Ein Nutzer mit Einschreibung SoSe 2025 erhält den Vorschlag `mi7-sose2025`.
- [ ] Der Planner öffnet erst nach ausdrücklicher SPO-Bestätigung.
- [ ] Ein nicht unterstützter Geltungsbereich öffnet keinen persönlichen Planner.
- [ ] Semester 1 zeigt ausschließlich das offizielle Modul `113114 Web Development` mit 5 ECTS.
- [ ] Modul, ECTS und Semester stammen aus validierter Konfiguration, nicht aus UI-Konstanten.
- [ ] Vor einem Abschlussdatensatz zeigt der Fortschritt `0 / 210 ECTS`.
- [ ] „Als bestanden markieren“ speichert `BE` und aktualisiert auf `5 / 210 ECTS`.
- [ ] Nach vollständigem Neuladen bleibt `BE` erhalten und der Wert wird neu berechnet.
- [ ] Zurücksetzen auf „offen“ entfernt den Abschlussdatensatz und zeigt wieder `0 / 210 ECTS`.
- [ ] Quelle, genaue Fundstelle, Regelgeneration und Quellenrevision sind erreichbar.
- [ ] Der Unvollständigkeits-Hinweis ist im Planner dauerhaft sichtbar.
- [ ] Es werden weder Name noch Matrikelnummer oder Note abgefragt.
- [ ] Der gesamte Weg ist per Tastatur bedienbar.
- [ ] Keine persönliche Information erscheint in URL oder Logs.
- [ ] Ein ungültiger gespeicherter Zustand wird nicht still übernommen oder überschrieben.

## 11. Test- und Verifikationsplan

### Schema und Domäne

- gültige Minimalkonfiguration wird akzeptiert
- fehlende Quelle, ungültige ECTS und unbekannte Modulreferenz werden abgelehnt
- persönlicher Zustand enthält keine offiziellen Moduldaten
- `sumCredits` liefert 0 beziehungsweise 500 Hundertstel-ECTS
- abgeleitete Ergebnisse werden nicht persistiert

### Persistenz

- leerer Zustand wird korrekt initialisiert
- bestätigter Plan wird gespeichert und geladen
- Setzen und Entfernen von `BE` ist round-trip-stabil
- ungültiger gespeicherter Zustand erzeugt einen sicheren Fehlerzustand

### Komponente und Accessibility

- Bestätigung kontrolliert den Eintritt in den Planner
- Statusaktion aktualisiert sichtbare ECTS
- Fokusreihenfolge ist logisch
- Statusänderung wird für assistive Technik verständlich angekündigt
- automatisierter `axe`-Check der beiden Kernansichten

### Playwright

1. Seite öffnen
2. SoSe 2025 auswählen
3. SPO bestätigen
4. Planner öffnen
5. `0 / 210 ECTS` prüfen
6. Web Development als bestanden markieren
7. `5 / 210 ECTS` und `BE` prüfen
8. Seite vollständig neu laden
9. persistierten Zustand erneut prüfen
10. Quelle öffnen und Fundstellen prüfen

### Manuelle Human-in-the-loop-Abnahme

- offizielle Fakten gegen das Quellenpaket vergleichen
- vollständigen Weg nur mit Tastatur bedienen
- bei kleiner und großer Breite auf Lesbarkeit prüfen
- sicherstellen, dass der Entwicklungs- und Unvollständigkeitsstatus nicht übersehen werden kann
- Diff auf unbeabsichtigte Framework- oder Scope-Erweiterungen prüfen

## 12. Technische Leitplanken

- Keine produktive Abstraktion für spätere Status oder Operatoren implementieren.
- Keine UI-Bibliothek ohne nachgewiesenen Bedarf hinzufügen.
- Keine offiziellen Daten in React-Komponenten duplizieren.
- Keine Regelresultate als Quelle der Wahrheit speichern.
- Keine Netzwerkübertragung persönlicher Daten.
- Keine Implementierung außerhalb des S1-Scope „vorsorglich“ ergänzen.
- Repository-Grundstruktur nur so weit anlegen, wie S1 sie tatsächlich benötigt.

## 13. Relevante Entscheidungen

- [ADR 0001](../decisions/0001-official-and-personal-data.md)
- [ADR 0002](../decisions/0002-module-component-attempt-model.md)
- [ADR 0003](../decisions/0003-declarative-rules-and-versioning.md)
- [Regel-Designproben](../architecture/rule-design-probes.de.md)

## 14. Ready-Gate

- [x] Nutzerergebnis in einem Satz beschrieben
- [x] In Scope und Nicht in Scope festgelegt
- [x] offizielle Quellen mit URL, Fundstelle und Hash dokumentiert
- [x] relevante UI grob skizziert
- [x] Daten- und Regelverhalten beschrieben
- [x] beobachtbare Akzeptanzkriterien vorhanden
- [x] automatischer und manueller Verifikationsplan vorhanden
- [x] fundamentale ADRs vorhanden
- [x] spätere Regelformen durch Designproben auf grundsätzliche Darstellbarkeit geprüft
- [x] menschliche Gate-Bestätigung des fachlichen Zuschnitts am 19. August 2026

Das Specification Gate ist geschlossen. Eine unabhängige Zweitprüfung der offiziellen Quellen bleibt Teil der Abnahme und wird durch diese Scope-Bestätigung nicht ersetzt.
