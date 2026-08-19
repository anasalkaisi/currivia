# S2-Recap: Bestehenden Studienverlauf korrekt erfassen

**Stand:** 19. August 2026
**Status:** Review

## Ergebnis

S2 liefert einen geführten, tastaturbedienbaren Erfassungsweg für den bestehenden Studienverlauf. Ein Student kann für das vorhandene quellenbelegte Modul einen offiziellen SELMA-Status sowie optionale Note, offizielle Versuchszahl und eine semesterübergreifende Prüfungsaktivität erfassen. Nur `BE` zählt ECTS; `EN` führt zu einem deutlichen offiziellen Klärungshinweis.

## Umgesetzt

- fünfstufiger Erfassungsassistent mit sichtbarem Fortschritt
- offizielle Status `AN`, `BE`, `NB`, `EN` und `RT`
- separates Modul- und Komponentenmodell
- optionale validierte Note und offizielle Versuchszahl
- komponentenbezogene Aktivität in einem abweichenden Fachsemester
- „nicht prüfbar“ bei fehlenden Komponentendaten
- sichtbarer Widerspruchshinweis ohne Überschreiben des Modulstatus
- verlustfreie Migration gespeicherter S1-`BE`-Datensätze auf Schema v2
- lokale Autosave- und Reload-Persistenz

## Verifikation

- Formatierung, Linting, Typprüfung und Produktionsbuild erfolgreich
- 24 Unit- und Integrationstests erfolgreich
- 3 Chromium-End-to-End-Tests erfolgreich
- automatisierte Accessibility-Prüfung von Onboarding, Planner, Assistent und gespeichertem EN-Zustand ohne Verstöße
- Desktop- und Mobilansicht im echten Browser geprüft
- visueller Fund „beibehaltene Scrollposition beim Routenwechsel“ behoben und erneut geprüft

## Erkenntnisse

- Der offizielle Modulstatus bleibt die einzige Grundlage der ECTS-Anrechnung.
- Komponenten erklären den Verlauf, dürfen aber einen offiziellen Modulstatus weder erzeugen noch überschreiben.
- S1-Zustände lassen sich ohne IndexedDB-Versionswechsel beim Lesen deterministisch migrieren und beim nächsten Speichern als Schema v2 ablegen.
- Der weiterhin unvollständige Ein-Modul-Datensatz begrenzt die Breite des Assistenten bewusst; der Ablauf ist auf mehrere Module vorbereitet, der vollständige Katalog bleibt außerhalb von S2.

## Bewusste Scope-Grenze

Es gibt keine Versuchslimit- oder Rechtsfolgenlogik, keinen Notendurchschnitt, keinen Dateiimport und keine Semesterplanung. `RT` wird nicht als Fehlversuch interpretiert. `EN` wird nicht als automatischer Verlust des Prüfungsanspruchs ausgelegt.

## Offen vor Abschluss

- menschliche fachliche und visuelle Abnahme
- unabhängige Zweitprüfung der bereits in S1 verwendeten offiziellen Quellen
- Review des S2-Diffs gegen den über Pull Request #2 gemergten S1-Stand
