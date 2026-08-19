# S1-Recap: Quellenbelegter ECTS-Walking-Skeleton

**Stand:** 19. August 2026
**Status:** Review
**GitHub-Issue:** [#1](https://github.com/anasalkaisi/currivia/issues/1)

## Ergebnis

S1 liefert den vollständigen ersten vertikalen Produktweg: Ein Student bestätigt die Regelgeneration `mi7-sose2025`, sieht genau das quellenbelegte Modul `113114 Web Development`, markiert es als bestanden und erkennt die Änderung von `0/210 ECTS` auf `5/210 ECTS`. Der persönliche Zustand bleibt nach einem Neuladen erhalten und kann zurückgesetzt werden.

## Umgesetzt

- validierte, versionierte Curriculumskonfiguration mit genau einem offiziellen Modul
- klare Trennung zwischen offiziellen Curriculumdaten und persönlichem Planstand
- deterministische ECTS-Summe für den Status `BE`
- lokaler persönlicher Zustand in IndexedDB einschließlich sicherer Fehleransicht bei ungültigen Daten
- Onboarding, Planner und Quellenansicht als tastaturbedienbarer Hash-Routen-Fluss
- sichtbare SPO-, Quellen- und Revisionsangaben
- CI-fähiges React-/TypeScript-Workspace mit Formatierung, Linting, Typprüfung, Tests und Produktionsbuild

## Verifikation

- Formatierungs-, Lint- und Typprüfungen erfolgreich
- Produktionsbuild erfolgreich
- 15 Unit- und Integrationstests erfolgreich
- 2 Chromium-End-to-End-Tests erfolgreich, einschließlich Reload, Reset, Tastaturweg und automatischer Accessibility-Prüfung
- manueller Browsercheck auf Desktop und Mobil ohne Konsolenfehler
- Nutzerführung und visuelle Ausführung am 19. August 2026 bestätigt

## Erkenntnisse und kleine Nacharbeiten

- Der Skip-Link setzt den Fokus ohne die Hash-Route zu überschreiben.
- Fortschritts-ARIA-Werte verwenden ECTS statt Prozent; Statusänderungen werden als Live-Region angekündigt.
- Curriculumdaten werden ausschließlich aus der validierten offiziellen Konfiguration gelesen.
- Context und Hook sind getrennt, damit die Entwicklungsaktualisierung ohne Lint-Ausnahme stabil bleibt.

## Bewusste Scope-Grenze

S2 wurde weder implementiert noch detailliert. Es gibt keine zusätzlichen Module, Statusoperatoren, Prognosen oder eine allgemeine Regel-Engine. S1 bleibt ein nicht öffentlich freigegebener Entwicklungsschnitt und kein vollständiger Studienplan.

## Offen vor Abschluss

- unabhängige Zweitprüfung der offiziellen Quellen
- Code-Review und Merge des S1-Draft-PRs
