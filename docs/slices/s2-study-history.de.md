# S2: Bestehenden Studienverlauf korrekt erfassen

**Status:** Review
**Stand:** 19. August 2026
**Ziel:** schneller, nachvollziehbarer Erfassungsweg für vergangene Semester
**Öffentliche Freigabe:** nein
**GitHub-Issue:** [#3](https://github.com/anasalkaisi/currivia/issues/3)

## Nutzerergebnis

> Als Medieninformatik-Student der Regelgeneration `mi7-sose2025` kann ich ein vergangenes Semester auswählen, den offiziellen SELMA-Status eines Moduls samt optionaler Note, Versuchszahl und Prüfungsbestandteilen erfassen und nach einem Neuladen nachvollziehen, welche ECTS zählen und welche Angaben noch nicht prüfbar sind.

## In Scope

- geführter Erfassungsassistent für vergangene Fachsemester
- offizielle Modulstatus `AN`, `BE`, `NB`, `EN` und `RT`
- Status des Moduls getrennt von Prüfungsbestandteilen
- optionale, aus SELMA übernommene Versuchszahl
- optionale, anhand der HdM-Notenskala validierte Note
- verknüpfte Komponentenaktivitäten in einem abweichenden Fachsemester
- ECTS-Anrechnung ausschließlich bei offiziellem Modulstatus `BE`
- „nicht prüfbar“ bei nicht erfassten Komponentendaten
- Widerspruchshinweis, ohne den offiziellen Modulstatus zu überschreiben
- kritischer offizieller Klärungshinweis bei `EN`
- Migration des S1-Zustands ohne Datenverlust
- synthetische Tests für alle Status und sichere Persistenz

## Nicht in Scope

- vollständiger Modulkatalog oder echte Verläufe in Fixtures
- Versuchslimits oder automatische Zählung von Fehlversuchen
- Rechtsauslegung von `RT` oder `EN`
- Notendurchschnitt und Abschlussnotenprognose
- Dateiimport und -export
- Semesterplanung, Verschieben und Ist-/Prognosevergleich aus S3
- komponentenbezogene Zulassungsregeln ohne belegte aktive Quelle

## Fachlicher Datenvertrag

- Der persönliche Zustand verwendet `schemaVersion = 2` und `moduleRecords`.
- Ein Modul besitzt höchstens einen offiziellen Modulstatusdatensatz.
- Die optionale Versuchszahl ist eine positive ganze Zahl und wird nie abgeleitet.
- Eine Note ist optional und muss in der konfigurierten Werteliste vorkommen.
- Komponentenaktivitäten verweisen auf eine bekannte offizielle Komponente und ein Fachsemester.
- Ein vorhandener S1-`BE`-Datensatz wird beim Laden deterministisch in einen S2-Moduldatensatz migriert; das damals nicht erfasste tatsächliche Fachsemester bleibt unbekannt.
- Nur `BE` trägt ECTS zur Ist-Summe bei.

## UI-Weg

1. Im Planner „Studienverlauf erfassen“ öffnen.
2. Tatsächliches vergangenes Fachsemester angeben; das empfohlene Semester dient nur als Orientierung.
3. Offizielles Modul des Semesters auswählen.
4. verständliche Statusbezeichnung mit SELMA-Code wählen.
5. Note und offizielle Versuchszahl optional ergänzen.
6. bekannte Prüfungsbestandteile optional detaillieren und deren Semester setzen.
7. Zusammenfassung prüfen und lokal speichern.

Der Assistent zeigt jederzeit den aktuellen Schritt. Zurück-Navigation löscht keine Eingaben. Ohne Modulstatus ist kein Abschluss möglich.

## Akzeptanzkriterien

- [ ] Alle fünf offiziellen Status sind auswählbar und bleiben nach Neuladen erhalten.
- [ ] Nur `BE` erhöht die bestandenen ECTS.
- [ ] `RT` wird weder als `NB` noch als verbrauchter Versuch interpretiert.
- [ ] `EN` zeigt einen auffälligen Hinweis zur sofortigen offiziellen Klärung, ohne eine Rechtsfolge zu behaupten.
- [ ] Modulstatus und Komponentenstatus werden getrennt angezeigt und gespeichert.
- [ ] Eine Komponente kann in einem anderen Fachsemester als das Modul liegen.
- [ ] Fehlende Komponentendetails erscheinen als „nicht prüfbar“, ohne den Modulstatus zu verändern.
- [ ] Ein offensichtlicher Widerspruch wird angezeigt, aber nicht automatisch korrigiert.
- [ ] Ungültige Noten, Versuchszahlen sowie Modul- oder Komponentenreferenzen werden abgelehnt.
- [ ] Ein gespeicherter S1-Zustand wird verlustfrei geladen und als S2 gespeichert.
- [ ] Der vollständige Kernweg ist per Tastatur bedienbar und hat keine automatischen Accessibility-Verstöße.

## Verifikation

- Schema- und Regeltests mit synthetischen Fällen für `AN`, `BE`, `NB`, `EN`, `RT`
- Migrationstest S1 → S2
- Persistenz-Round-trip mit Note, Versuch und semesterübergreifender Komponente
- Komponenten-/Accessibility-Test des Assistenten
- Playwright-Weg für Erfassung, Reload, EN-Hinweis und Komponentenaktivität
- manuelle Prüfung von Tastaturweg, kleinen/großen Breiten und verständlichen Statusformulierungen

## Relevante Entscheidungen

- [MVP-Spezifikation, Abschnitte 6 und 8](../product/mvp-specification.de.md)
- [ADR 0001](../decisions/0001-official-and-personal-data.md)
- [ADR 0002](../decisions/0002-module-component-attempt-model.md)

## Ready-Gate

- [x] Nutzerergebnis, Scope und Nicht-Scope sind festgelegt.
- [x] Der UI-Weg ist beschrieben.
- [x] Statussemantik und Datenherkunft folgen der eingefrorenen MVP-Spezifikation.
- [x] Komponentenangaben des vorhandenen Moduls stammen aus dem bereits dokumentierten Quellenpaket.
- [x] Akzeptanz- und Testkriterien sind beobachtbar.
- [x] Die Umsetzung benötigt keine neue Rechtsauslegung oder neue formale Regel.
