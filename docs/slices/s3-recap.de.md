# S3-Recap: Semester planen und Prognose verstehen

**Stand:** 22. August 2026
**Status:** Gemergt ([Pull Request #6](https://github.com/anasalkaisi/currivia/pull/6), Issue #5)

## Ergebnis

S3 ergänzt auf dem S2-Verlauf eine semesterbasierte Planungszeitachse. Ein Student kann das aktuelle Hochschulsemester bestätigen, Module vollständig tastaturbedienbar zwischen Fachsemestern oder nach „Noch nicht eingeplant“ verschieben und dabei klar zwischen bestandenem Ist-Fortschritt und der hypothetischen Prognose „Wenn alles bestanden wird“ unterscheiden. Die Planungszuordnung bleibt vom offiziellen S2-Moduldatensatz getrennt; eine Verschiebung verändert keinen Status, kein tatsächliches Semester und keine Versuchsdaten.

## Umgesetzt

- semesterbasierte Zeitachse mit regulären Fach- und getrennten Kalendersemestern
- Bestätigung des datumsbasiert vorgeschlagenen aktuellen Hochschulse­mesters
- Urlaubs- und Unterbrechungssemester ohne automatisches Hochzählen des Fachsemesters
- Desktop-Ansicht mit benachbarten Semesterkarten und direkter Semesternavigation; mobile Einzelansicht
- explizites, tastaturbedienbares Verschieben inklusive „Noch nicht eingeplant“
- lokales Rückgängig für die letzte Verschiebe- oder Ausplanaktion
- separat beschrifteter Ist-Wert und Prognosewert
- Modell und UI-Zustand für unbestätigte Wahlpflichtverfügbarkeit und persönliche Verfügbarkeitsnotiz
- Relevanz statt Warnungsflut: Verfügbarkeitshinweis als sachliche Information am betroffenen Objekt
- verlustfreie Migration gespeicherter Pläne auf Schema-Version 3
- lokale Autosave-Persistenz mit sichtbarem Speicherstatus

## Verifikation

- Formatierung, Linting, Typprüfung und Produktionsbuild erfolgreich
- 35 Unit- und Integrationstests erfolgreich (Schema 9, Regeln 7, Web 19)
- Chromium-End-to-End-Tests für den S3-Planungsweg erfolgreich
- manueller Browser-Test auf Desktop

## Erkenntnisse

- Planungszuordnung und offizieller Moduldatensatz sind bewusst getrennte Konzepte; nur so lässt sich die Invariante durchsetzen, dass geplante ECTS nie als bestanden erscheinen.
- Die Migration von Schema v2 auf v3 erfolgt beim Laden bzw. Speichern verlustfrei; bestehende S2-Zustände bleiben erhalten.
- Eine vollständige Undo-/Redo-Historie war nicht nötig; das lokale Rückgängig genau der letzten riskanten Aktion deckt den Nutzerweg ab.

## Bewusste Scope-Grenze

Kein vollständiger Modul- oder Wahlpflichtkatalog, keine formale Voraussetzungs- oder Stichtagsprüfung (S4), keine Anforderungsgruppen (S5), keine vollständige Aktionshistorie, kein Drag-and-drop als notwendiger Bedienweg, keine selbst angelegten Module. Der Curriculumsdatensatz bleibt ein unvollständiger Entwicklungsstand und darf nicht als vollständiger Studienplan veröffentlicht werden.

## Offen

- menschliche fachliche und visuelle Abnahme des gemergten Standes
- unabhängige Zweitprüfung der verwendeten offiziellen Quellen bleibt ausstehend
