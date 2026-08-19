# Currivia: Verbindliche MVP-Spezifikation

**Stand:** 19. August 2026
**Status:** Scope Freeze / Shared Understanding abgeschlossen / Phase 4 in Vorbereitung
**Zielrelease:** `v0.1.0-alpha.x`
**Erste Konfiguration:** Bachelor Medieninformatik, HdM, Regelgeneration `mi7-sose2025`

## 1. Zweck dieses Dokuments

Dieses Dokument konsolidiert die Entscheidungen aus der Machbarkeitsanalyse und dem anschließenden Design-Interview. Es ist die verbindliche Grundlage für Produktspezifikation, Architektur, Regelmodell, UX, Pilot und Release des MVP.

Bei einem Widerspruch zu älteren Planungsnotizen gilt diese Spezifikation. Neue Wünsche werden nach dem Scope Freeze nicht zusätzlich in den MVP aufgenommen. Eine neue Funktion darf vor dem Pilot nur aufgenommen werden, wenn:

- eine gleich große Funktion aus dem MVP entfernt wird oder
- ein belegtes Sicherheits-, Datenintegritäts- oder Korrektheitsproblem die Änderung erforderlich macht.

## 2. Produktziel und Prioritäten

### 2.1 Primäres Ziel

Das primäre Ziel von `v0.1.0-alpha` ist ein nützlicher und vertrauenswürdiger Pilot für Studierende des Bachelorstudiengangs Medieninformatik an der Hochschule der Medien Stuttgart, für die die Regelgeneration `mi7-sose2025` gilt.

Die Prioritäten lauten:

1. Korrekte, nachvollziehbare Regelprüfung
2. Selbstständig nutzbare Studienplanung für die Pilotgruppe
3. Schutz und Integrität persönlicher Studienplandaten
4. Verständliche Trennung von Ist-Zustand, Prognose und unverbindlichem Hinweis
5. Gute Wartbarkeit der Curriculumsdaten
6. Persönlicher Nutzen

Visuelle Außenwirkung oder Funktionsmenge dürfen nicht auf Kosten der Regelkorrektheit gehen.

### 2.2 Produktversprechen

> Currivia ist ein lokaler, quellenbasierter Studienverlaufsplaner. Er zeigt, was abgeschlossen, geplant und noch offen ist, und erklärt nachvollziehbar die Anforderungen der bestätigten SPO-Konfiguration.

Currivia ist keine Prüfungsverwaltung, keine verbindliche Studienberatung und kein automatischer Entscheidungsträger.

### 2.3 Zielgruppe des MVP

Der echte Planner ist ausschließlich für Personen vorgesehen, die alle folgenden Bedingungen bestätigen:

- Studiengang: Bachelor Medieninformatik an der HdM
- geltende Prüfungsordnung: `mi7-sose2025`
- Verständnis, dass Currivia keine verbindliche Prüfungsentscheidung trifft

Personen außerhalb dieser Konfiguration werden nicht in einen persönlichen Planner gelassen. Für Portfolio-Besucher und andere Interessierte gibt es einen klar gekennzeichneten, schreibgeschützten Demo-Modus mit synthetischen Daten.

## 3. Onboarding und SPO-Auswahl

### 3.1 Ermittlung der Regelgeneration

Currivia fragt beim Einstieg nach:

- Studiengang
- erstmaligem Einschreibesemester
- aktueller Prüfungsordnungsversion

Aus Studiengang und Einschreibesemester wird eine Regelgeneration vorgeschlagen. Diese Ableitung ist nur eine Hilfe und keine abschließende Feststellung.

Die Leistungsübersicht beziehungsweise SELMA enthält ein eigenes Feld zur Prüfungsordnungsversion. Das Onboarding erklärt, wo dieses Feld gefunden werden kann. Der Nutzer muss die vorgeschlagene Regelgeneration anhand seiner offiziellen Unterlagen ausdrücklich bestätigen.

### 3.2 Sonderfälle

Der MVP unterstützt keine freie Auswahl beliebiger SPO-Versionen und keine automatische Behandlung von:

- Hochschulwechseln
- Wiedereinstiegen
- freiwilligen SPO-Wechseln
- individuellen Anerkennungs- oder Härtefallentscheidungen

Bei einem Sonderfall verweist Currivia auf die offizielle Klärung. Eine freie Versionsauswahl wird erst relevant, wenn mehrere geprüfte Regelgenerationen hinterlegt sind.

### 3.3 Rechtlicher und fachlicher Hinweis

Der Hinweis „keine verbindliche Studienberatung“ wird:

- im Onboarding kurz bestätigt,
- in Hilfe und Information dauerhaft zugänglich gemacht und
- bei kritischen Regelhinweisen kontextbezogen wiederholt.

Es gibt kein permanentes Warnbanner auf jeder Ansicht.

## 4. Kern-Workflow

### 4.1 Startzustand

Nach dem Onboarding entsteht kein leerer Plan:

- Pflichtmodule werden entsprechend dem in der offiziellen Konfiguration vorgesehenen Fachsemester eingeordnet.
- Wahlpflichtmodule erscheinen zunächst in einer ungewählten Auswahl.
- Sie werden nicht automatisch als belegt oder tatsächlich angeboten dargestellt.

### 4.2 Primäre Startansicht

Nach dem Onboarding öffnet Currivia direkt den Semesterplan. Eine eigene Dashboard-Startseite gibt es nicht.

Der Planner zeigt kompakt:

- bestandene ECTS
- Fortschritt nach Anforderungsgruppen
- relevante offene Hinweise
- das fokussierte Semester und seine Nachbarsemester

Eine separate Prüfansicht enthält die vollständigen Anforderungen, Regelresultate und Quellen.

### 4.3 Gerätepriorität

Die Planung wird primär für Laptop und Desktop optimiert. Smartphone und Tablet bleiben vollständig bedienbar und barrierefrei.

Desktop:

- drei Semesterkarten nebeneinander: vorheriges, fokussiertes und nächstes Semester
- kompakte Semesterleiste zum direkten Springen
- zusätzliche Gesamtübersicht mit ECTS und Warnungen je Semester

Smartphone:

- Semester werden nacheinander statt in einer breiten Mehrspaltenansicht gezeigt
- alle Aktionen funktionieren ohne Drag-and-drop

### 4.4 Initiale Semester

Der Plan legt automatisch die sieben regulären Fachsemester an. Weitere Semester können ergänzt werden.

Standardmäßig fokussiert die Oberfläche:

- das aktuelle Semester
- das vorherige Semester
- das nächste Semester

### 4.5 Fachsemester und Kalendersemester

Currivia speichert beide Konzepte getrennt:

- Fachsemester als Bezug für Regeln und Regelstudienverlauf
- Kalendersemester wie `SoSe 2026` oder `WiSe 2026/27` als zeitliche Planung

Die Zuordnung wird aus dem Einschreibesemester vorgeschlagen, kann aber korrigiert werden.

Urlaubs- und Unterbrechungssemester werden als Kalendersemester ohne automatisch erhöhtes Fachsemester modelliert. Currivia entscheidet nicht selbst, ob ein Sondersemester prüfungsrechtlich mitzählt. Der Nutzer bestätigt die Fachsemesterzählung anhand seiner offiziellen Unterlagen.

Wird das Einschreibesemester später korrigiert, zeigt Currivia vorab eine Vorschau. Fachsemester und vorhandene Versuche bleiben erhalten. Nur automatisch abgeleitete Kalenderbezeichnungen werden angepasst; manuell korrigierte Semester werden nicht still überschrieben.

Das aktuelle Hochschulsemester wird anhand des Datums nur vorgeschlagen und muss bestätigt werden.

## 5. Studienplan und Interaktionen

### 5.1 Offizielle Module

Offizielle Module können nicht gelöscht werden. Sie können:

- einem Semester zugeordnet,
- in ein anderes Semester verschoben oder
- in „noch nicht eingeplant“ abgelegt werden.

Nur selbst angelegte Module dürfen gelöscht werden.

### 5.2 Wahlpflichtmodule und Verfügbarkeit

Ein Wahlpflichtmodul darf geplant werden, auch wenn keine verlässliche Angebotsinformation vorliegt. In diesem Fall wird seine Verfügbarkeit als „nicht bestätigt“ gekennzeichnet.

Das in SPO oder Modulhandbuch vorgesehene Fachsemester ist keine Bestätigung, dass ein Modul in einem konkreten Sommer- oder Wintersemester angeboten wird.

Nutzer können eine vermutete Verfügbarkeit als persönliche Notiz erfassen. Diese Notiz:

- ist klar als persönliche Angabe markiert,
- beeinflusst keine formale Regel und
- wird nicht als offizielle Information dargestellt.

### 5.3 Regelverletzungen blockieren keine Planung

Currivia verhindert keine Planänderung aufgrund einer verletzten Studienregel. Auch vorläufig ungültige Szenarien dürfen erstellt werden.

Stattdessen zeigt Currivia:

- was nicht erfüllt ist,
- welche Differenz besteht,
- zu welchem Zeitpunkt die Regel relevant ist und
- auf welcher Quelle die Aussage beruht.

Strukturell ungültige Daten, unsichere Imports oder inkonsistente Dateien dürfen dagegen abgelehnt werden.

### 5.4 Verschieben und Rückgängig

Drag-and-drop ist optional und niemals der einzige Bedienweg. Jedes Modul kann über Tastatur und ein explizites „In Semester verschieben“-Steuerelement bewegt werden.

Eine vollständige Undo-/Redo-Historie gehört nicht zum MVP. Nach riskanten Einzelaktionen erscheint kurz eine Möglichkeit zum Rückgängigmachen, insbesondere bei:

- Verschieben eines Planobjekts
- Entfernen einer Planung
- Löschen eines eigenen Moduls

Import und Gesamtlöschung besitzen eigene Bestätigungsabläufe.

## 6. Ersterfassung bestehender Leistungen

### 6.1 Geführter Erfassungsassistent

Bestehende Leistungen werden ohne Dateiimport über einen Erfassungsassistenten eingetragen:

1. Vergangene Semester auswählen
2. Module pro Semester gesammelt markieren
3. Offiziellen Modulstatus setzen
4. Noten optional ergänzen
5. Sonderfälle, Versuche und Prüfungsbestandteile bei Bedarf detaillieren

Bei Modulen mit bekannten Prüfungsbestandteilen wird ein optionaler zweiter Schritt angeboten. Dieser Schritt wird nur verpflichtend, wenn eine aktive Regel andernfalls nicht prüfbar wäre.

### 6.2 Zeitziele

Ein typischer Nutzer mit zwei bis vier abgeschlossenen Semestern soll seinen bisherigen Verlauf ohne Noteneingabe in weniger als 15 Minuten erfassen können.

Eine grobe Planung der verbleibenden Semester soll anschließend in weniger als zehn Minuten möglich sein, einschließlich:

- Auswahl gewünschter Wahlpflichtmodule
- Einordnung in Semester
- Erkennen der wichtigsten offenen Voraussetzungen

## 7. Fachliches Datenmodell

### 7.1 Getrennte Datenebenen

Currivia trennt strikt:

1. gebündelte, unveränderliche offizielle Konfiguration
2. persönliche lokale Eingaben
3. daraus abgeleitete Regel- und Fortschrittsergebnisse

Abgeleitete Ergebnisse werden nicht als fachliche Wahrheit in IndexedDB gespeichert. Sie werden bei Bedarf deterministisch neu berechnet. Gespeichert werden nur persönliche Daten und wenige UI-Metadaten, beispielsweise ob ein geänderter Hinweis bereits gesehen wurde.

### 7.2 CurriculumItem

Praxissemester und Bachelorarbeit werden nicht als identische normale Module modelliert. Alle Curriculumsbausteine teilen gemeinsame Grundfelder, verwenden aber einen Typ:

- `module`
- `internship`
- `thesis`

Dadurch können ECTS, Status, Semester und Quellen gemeinsam verarbeitet werden, während typabhängige Eigenschaften getrennt bleiben.

### 7.3 Stabile Identität

Jeder Curriculumsbaustein besitzt eine eigene unveränderliche interne ID. Offizieller Modulcode und Modulname sind versionierte Attribute.

Wenn sich Code oder Name ändern:

- wird die alte ID nicht umgedeutet,
- kann eine explizite Nachfolgerbeziehung hinterlegt werden und
- bleiben bestehende persönliche Verweise reproduzierbar.

Wird ein Modul entfernt oder ersetzt, löscht oder verschiebt Currivia keine persönlichen Daten. Das alte Modul bleibt historisch sichtbar. Eine Nachfolgerzuordnung wird nur angeboten und muss bestätigt werden.

### 7.4 ECTS

ECTS-Werte dürfen Dezimalstellen enthalten und werden intern als Hundertstel-ECTS gespeichert.

Beispiel:

```text
2,5 ECTS → 250
```

Dadurch entstehen keine Gleitkommafehler.

Tatsächlich bestandene ECTS und Anforderungserfüllung werden getrennt angezeigt. Beispiel:

```text
68 ECTS bestanden · Anforderung 63/63 erfüllt
```

Fortschrittsbalken überschreiten nicht 100 Prozent. Überschüssige ECTS werden nicht automatisch anderen Kategorien zugerechnet.

### 7.5 Selbst angelegte Module

Eigene Module können geplant und mit ECTS, Semester und Status versehen werden. Im MVP werden sie jedoch nicht auf offizielle Anforderungen angerechnet.

Sie erscheinen:

- im persönlichen Verlauf
- in einer getrennten ECTS-Summe
- klar als persönliche Einträge

Eine offizielle Anrechnung benötigt später einen eigenen Anerkennungsdatensatz mit Beleg.

## 8. Modulstatus, Prüfungsbestandteile und Versuche

### 8.1 Planungsstatus und offizielle Status

Currivia unterscheidet einen eigenen Planungsstatus von den offiziellen SELMA-Status.

Planungsstatus:

- `planned` – geplant, noch kein offizieller SELMA-Status

Offizielle Status:

| Code | Bedeutung                            | Wirkung im MVP                                          |
| ---- | ------------------------------------ | ------------------------------------------------------- |
| `AN` | Modul begonnen / Leistung angemeldet | keine bestandenen ECTS                                  |
| `BE` | Leistung bestanden                   | ECTS zählen entsprechend dem offiziellen Modulabschluss |
| `NB` | Leistung nicht bestanden             | keine ECTS; Verlauf bleibt offen                        |
| `EN` | Leistung endgültig nicht bestanden   | kritischer Hinweis zur offiziellen Klärung              |
| `RT` | Rücktritt                            | keine ECTS; nicht automatisch als Fehlversuch zählen    |

Die Oberfläche verwendet primär verständliche deutsche Bezeichnungen. Die SELMA-Codes werden in Detail-, Übertragungs- und Diagnoseansichten zusätzlich gezeigt.

### 8.2 Keine automatische Rechtsauslegung

Currivia leitet nicht selbst ab:

- ob `RT` als Versuch zählt,
- ob ein Nichterscheinen entschuldigt war,
- wie viele Versuche verbleiben oder
- welche Rechtsfolge aus `EN` entsteht.

Bei `EN` werden keine weiteren Versuche automatisch vorgeschlagen. Currivia zeigt einen deutlichen Hinweis zur sofortigen offiziellen Klärung, berechnet aber keinen endgültigen Studienabbruch.

### 8.3 Versuchszahlen

Versuchszahlen werden optional genau so erfasst, wie sie in SELMA ausgewiesen sind. Currivia zählt sie niemals selbst aus Statusfolgen hoch.

Geplante Versuche besitzen keine offizielle Versuchszahl.

### 8.4 Modulstatus und Prüfungsbestandteile

Der offizielle Modulstatus wird separat erfasst und entscheidet über die ECTS-Anrechnung.

Prüfungsbestandteile und ihre Versuche erklären den Verlauf, etwa:

- Modulprüfung
- Vorleistung
- andere offiziell separat ausgewiesene Komponenten

Currivia darf offensichtliche Widersprüche zwischen Modulstatus und bekannten Bestandteilen anzeigen, überschreibt den offiziellen Modulstatus aber nicht. Es könnten Bestandteile fehlen, die der Nutzer noch nicht erfasst hat.

### 8.5 Umfang der Komponentenmodellierung

Im MVP werden nur Prüfungsbestandteile modelliert, die:

- in offiziellen Unterlagen einen eigenen Status oder Versuch besitzen oder
- eine formale Voraussetzung beeinflussen.

Interne Übungen, einzelne Abgaben und Projektmeilensteine bleiben außerhalb des MVP.

Prüfungsbestandteile können in verschiedenen Semestern liegen. Ein Modul kann deshalb über mehrere Semester aktiv sein. In jedem betroffenen Semester erscheint eine verknüpfte Aktivitätskarte, die auf denselben Moduldatensatz verweist. Das Modul wird nicht dupliziert und ECTS werden nicht mehrfach gezählt.

### 8.6 Voraussetzungen zwischen Komponenten

Die Regel-Engine kann Abhängigkeiten zwischen Prüfungsbestandteilen modellieren, beispielsweise:

```text
Vorleistung bestanden → Teilnahme an Modulprüfung möglich
```

Eine solche Regel wird nur aktiviert, wenn sie durch eine offizielle Fundstelle belegt ist. Erfahrungswissen dient als Recherchehinweis, nicht als alleinige Regelquelle.

### 8.7 Noten

Noten sind optional. Currivia berechnet im MVP weder Notendurchschnitt noch prognostizierte Abschlussnote.

Die zulässigen Noten- und Sonderwerte werden durch die Hochschul- beziehungsweise Curriculums-konfiguration vorgegeben. Freitext wird nicht als Note akzeptiert.

Eine spätere Durchschnittsberechnung benötigt belegte Regeln zu:

- berücksichtigten Modulen
- Gewichtungen
- Bachelorarbeit und Kolloquium
- zusätzlichen Wahlpflichtleistungen
- anerkannten und unbenoteten Leistungen
- Rundung

## 9. Anrechnung und Kategorien

### 9.1 Hierarchische Anrechnung

ECTS dürfen nur entlang einer Anforderungshierarchie mehrfach sichtbar sein.

Beispiel:

- ein Wahlpflichtmodul zählt zu „Wahlpflicht“ und zur übergeordneten Gesamtsumme,
- es erfüllt aber nicht automatisch zwei parallele Wahlpflicht-Unterbereiche.

Doppelanrechnung zwischen Geschwisterkategorien ist nur zulässig, wenn eine belegte Regel dies ausdrücklich erlaubt.

### 9.2 Mehrdeutige Zuordnung

Kann ein offizielles Modul mehreren parallelen Bereichen zugeordnet werden, kann der Nutzer eine geplante Zuordnung auswählen. Currivia zeigt alternative gültige Zuordnungen.

Eine nur geplante oder unbestätigte Zuordnung:

- zählt ausschließlich in der Prognose,
- markiert keine Ist-Anforderung als erfüllt und
- bleibt im Ist-Zustand `nicht prüfbar`, bis eine offizielle Zuordnung vorliegt.

Eine dokumentierte persönliche SELMA-Zuordnung wird bei einer neuen Konfiguration nicht überschrieben. Widerspricht sie der neuen Konfiguration, zeigt Currivia den Konflikt und setzt betroffene Ergebnisse auf `nicht prüfbar`.

### 9.3 Fachfremde und Mobile-Medien-Module

Im offiziellen Katalog erscheinen nur Module, deren Anrechenbarkeit für `mi7-sose2025` aus einer offiziellen Quelle hervorgeht.

Aus einer bloßen Katalog- oder Studiengangszugehörigkeit wird keine Anrechenbarkeit abgeleitet.

## 10. Regel-Engine

### 10.1 Grundprinzip

Die Regel-Engine ist:

- deterministisch
- unabhängig von React und Darstellung
- unabhängig von IndexedDB
- mit synthetischen Zuständen vollständig testbar
- frei von dynamisch ausgeführtem Konfigurationscode

### 10.2 Deklarative Regelsprache

Regeln werden mit einer begrenzten deklarativen Sprache aus fest implementierten und getesteten Bausteinen beschrieben, beispielsweise:

- `sumCredits`
- `modulePassed`
- `componentPassed`
- `allOf`
- `anyOf`
- `maxSelections`
- `beforeSemester`
- `mustPassBefore`
- `mustTakeTogether`
- `mutuallyExclusive`

Konfigurationen kombinieren diese Bausteine, dürfen jedoch keinen eigenen Code und keine freien ausführbaren Ausdrücke enthalten. Eine neue Regelart erfordert bewusst eine Änderung der Engine.

### 10.3 Regelbeziehungen

Mindestens folgende Beziehungen werden getrennt modelliert:

- `mustPassBefore` – vorher bestanden
- `mustTakeTogether` – im selben Semester belegen
- `mutuallyExclusive` – nicht gemeinsam anrechnen

Sie dürfen nicht in einem unspezifischen Voraussetzungen-Feld vermischt werden.

### 10.4 Ergebniszustände

Jede Regelauswertung liefert genau einen fachlichen Zustand:

- `satisfied` – erfüllt
- `unsatisfied` – nicht erfüllt
- `unknown` – wegen fehlender oder widersprüchlicher Daten nicht prüfbar
- `notApplicable` – für diesen Zustand oder Zeitpunkt nicht anwendbar

Fehlende Daten dürfen niemals als Regelverstoß erscheinen.

Ein technischer Auswertungsfehler wird ebenfalls sicher als `nicht prüfbar` mit Diagnose-ID behandelt. Andere Regeln bleiben verfügbar.

### 10.5 Strukturierte Ergebnisse

Die Engine erzeugt keine fertigen UI-Texte. Sie liefert strukturierte Ergebnisse mit:

- Regel-ID
- Zustand
- Ist- und Sollwerten
- betroffenen Modulen oder Komponenten
- Zeitpunkt beziehungsweise Stichtag
- Quellenreferenzen
- Diagnoseinformationen

Die Konfiguration enthält verständliche Textvorlagen. Die Web-App rendert daraus die deutschen Hinweise.

### 10.6 Ist-Zustand und Prognose

Tatsächliche ECTS und Zulassungen berücksichtigen ausschließlich offiziell als bestanden erfasste Module.

Für einen geplanten zukünftigen Zeitpunkt zeigt Currivia separat eine Prognose „Wenn alles bestanden wird“. In dieser Prognose dürfen vorher liegende geplante oder angemeldete Leistungen berücksichtigt werden.

Für eine Voraussetzung zu Beginn eines Semesters zählen nur Leistungen, die vor Beginn dieses Semesters als bestanden erfasst sind. Leistungen aus demselben Semester zählen nicht rückwirkend als vorher erfüllt.

### 10.7 Relevanz und progressive Hinweise

Ein Erstsemester erhält nicht sofort alarmierende Hinweise zu Bachelorarbeit, Praxissemester und 210 fehlenden ECTS.

Offene Abschlussanforderungen erscheinen zunächst neutral als Fortschritt. Handlungsbedarf entsteht erst, wenn:

- eine Voraussetzung zum geplanten Zeitpunkt relevant wird oder
- eine belegte Frist näherkommt.

### 10.8 Hinweisstufen

Currivia verwendet drei sichtbare Stufen:

1. **Handlungsbedarf:** Eine belegte Voraussetzung ist im Ist-Zustand nicht erfüllt.
2. **Planungsrisiko:** Der geplante Verlauf könnte eine Regel oder Frist verletzen.
3. **Information:** Daten fehlen, Verfügbarkeit ist unbestätigt oder offizielle Klärung wird empfohlen.

Keine Stufe bedeutet „rechtsverbindlich unzulässig“.

### 10.9 Platzierung von Hinweisen

Regelhinweise sind erreichbar:

- direkt am betroffenen Modul, Bestandteil oder Semester
- gesammelt in einer nach Dringlichkeit sortierten Prüfansicht

Beide Darstellungen verwenden dasselbe strukturierte Engine-Ergebnis. Es gibt keine doppelte Regelimplementierung in der UI.

## 11. Verbindlicher Regelumfang

### 11.1 Mindestumfang für den Pilot

Mindestens folgende Regeln müssen belegt und implementiert sein:

- 210 ECTS insgesamt
- 60 ECTS Grundstudium
- 87 ECTS Pflichtbereich Hauptstudium
- 63 ECTS Wahlpflicht
- mindestens 45 zulässige ECTS aus Medieninformatik beziehungsweise anrechenbaren Mobile-Medien-Angeboten
- Zwischenprüfung
- Praxissemester einschließlich der belegten 70-ECTS-Voraussetzung
- Bachelorarbeitsvoraussetzungen

### 11.2 Regeln, die bei Unklarheit offen bleiben dürfen

Games-/VR-Auswahlregeln und Kopplungen der Projektmitarbeit dürfen im Pilot als „noch nicht geprüft“ erscheinen, wenn sie nicht rechtzeitig eindeutig belegt werden können.

Allgemeines Prinzip:

- unklare Regeln werden nicht implementiert,
- fehlende Prüfungen werden sichtbar aufgeführt,
- Currivia suggeriert keine Vollständigkeit und
- es wird niemals geraten.

### 11.3 Versuchslimits

Warnungen vor dem Verlust des Prüfungsanspruchs durch zu viele Fehlversuche gehören nicht zum garantierten MVP-Regelsatz.

Sie dürfen erst aktiviert werden, wenn Versuchslimits, Fristen, Ausnahmen und betroffene Prüfungsarten vollständig belegt und zweitgeprüft sind.

### 11.4 Studienhöchstdauer

Die Studienhöchstdauer darf als unverbindlicher Fristenhinweis geprüft werden. Currivia zeigt:

- die normale SPO-Grenze
- die zugrunde gelegte Fachsemesterzählung
- einen Hinweis auf mögliche Sonderfälle

Currivia behauptet niemals automatisch, der Prüfungsanspruch sei erloschen.

### 11.5 Keine Belastungsbewertung

Currivia zeigt die ECTS-Summe eines Semesters, warnt aber nicht pauschal bei mehr oder weniger als 30 ECTS. Es gibt im MVP keinen persönlichen Belastungs- oder Optimierungsscore.

### 11.6 Keine automatische Modulempfehlung

Currivia priorisiert nicht automatisch, welche Module als Nächstes belegt werden sollen.

Es darf deterministisch filtern:

- Voraussetzungen laut Plan erfüllt
- noch offen

Es behauptet jedoch weder tatsächliche Verfügbarkeit noch optimale Reihenfolge.

## 12. Quellen, Nachvollziehbarkeit und Prüfstatus

### 12.1 Pflichtnachweis pro Regel

Jede aktive formale Regel benötigt:

- eindeutige ID
- maschinenlesbare Bedingung
- verständliche Textvorlage
- Gültigkeitsbereich
- Dokumenttitel
- Veröffentlichungsdatum, soweit vorhanden
- Abrufdatum
- stabile URL
- Dateihash
- Seiten-, Tabellen- oder Paragraphenangabe
- kurzen relevanten Textauszug
- Prüfstatus
- Prüfdatum
- positive, negative und unbekannte Testfälle

Das vollständige offizielle PDF wird nicht öffentlich im Repository dupliziert. Es kann für die interne Prüfung lokal archiviert werden.

### 12.2 Zulässige Quellen

Eine aktive öffentliche Regel braucht eine dauerhaft zugängliche offizielle Grundlage.

Nur intern zugängliche Moodle- oder SELMA-Mitteilungen dürfen:

- einen Klärungsbedarf auslösen,
- aber nicht alleinige öffentliche Regelquelle sein.

Sie werden weder automatisiert abgerufen noch im Repository veröffentlicht.

### 12.3 Quellenkonflikte

Wenn SPO, Modulhandbuch und SELMA-Anzeige widersprüchlich wirken, behauptet Currivia keinen automatischen Vorrang.

Der Konflikt wird dokumentiert, die betroffene formale Regel deaktiviert beziehungsweise auf `nicht prüfbar` gesetzt und fachlich geklärt.

SELMA ist Quelle für den persönlichen Leistungsstatus, nicht automatisch für allgemeine Studienregeln.

### 12.4 Prüfstatus

Prüfstatus wird nicht nur für die gesamte Konfiguration, sondern für jede Regel und jedes quellenrelevante Modulmerkmal gespeichert.

Der Gesamtstatus kann nicht besser sein als das schwächste aktive kritische Element.

Statussemantik:

- `unverified` – noch nicht unabhängig geprüft
- `community-reviewed` – dokumentierte Community-Prüfung, aber keine vollständige fachkundige Zweitprüfung
- `verified` – vollständige dokumentierte Zweitprüfung durch eine fachkundige Person
- `institution-confirmed` – zusätzliche ausdrückliche Bestätigung durch eine zuständige Institution; suggeriert keine allgemeine Produktfreigabe
- `deprecated` – weiterhin nutzbar, aber mit sichtbarem Pflegehinweis
- `archived` – keine neuen Pläne; bestehende Daten nur ansehen und exportieren, Ergebnisse nicht mehr als aktuell gepflegt darstellen

### 12.5 Zweitprüfung

`verified` erfordert eine unabhängige Prüfung aller aktiven Regeln durch eine fachkundige Person. Die Prüfung wird dokumentiert mit:

- Prüferkennung
- Prüfdatum
- Quellrevision
- Git-Commit
- Checkliste im Pull Request

Eine bloße Checkbox in der Curriculumsdatei genügt nicht.

Jede inhaltliche Änderung an Regel oder Quelle setzt den betroffenen Status automatisch auf `unverified`. CI verwendet dazu einen Inhalts- beziehungsweise Quellenhash.

### 12.6 Pilot mit unverified-Konfiguration

Der Pilot darf als ausdrücklich gekennzeichneter Alpha-Test mit einer `unverified`-Konfiguration beginnen. Der Status wird beim Einstieg und bei Regelauswertungen erklärt.

Die App wird erst nach der vereinbarten Zweitprüfung öffentlich beworben.

## 13. Versionierung

Vier Werte werden getrennt geführt:

- `appVersion` – SemVer für die Anwendung
- `schemaVersion` – fortlaufende ganze Zahl für persönliche Daten und Export
- `regulationVersion` – fachliche Regelgeneration, beispielsweise `mi7-sose2025`
- `sourceRevision` – konkrete geprüfte Quellenrevision

Alle Werte erscheinen in Diagnose und Export.

### 13.1 Neue Quellenrevision derselben Regelgeneration

Wenn eine neue geprüfte `sourceRevision` für dieselbe `regulationVersion` erscheint:

- wechselt Currivia automatisch auf die neue Revision,
- persönliche Daten bleiben unverändert,
- alle Regeln werden neu berechnet,
- ein kurzer Änderungsnachweis wird angezeigt und
- geänderte Ergebnisse bleiben markiert, bis der Nutzer sie gesehen hat.

### 13.2 Konfigurationen im Build

SPO-Konfigurationen werden nicht zur Laufzeit aus einem externen Repository geladen. Jede veröffentlichte App bündelt ihre geprüften Konfigurationen unveränderlich im Build.

Eine Aktualisierung erfolgt ausschließlich über einen neuen getesteten Release.

## 14. Lokale Datenhaltung

### 14.1 Profilmodell

Eine Browserinstallation verwaltet genau einen lokalen persönlichen Plan. Mehrere Profile gehören nicht zum MVP.

### 14.2 Speichern

Änderungen werden automatisch und unmittelbar lokal gespeichert. Die Oberfläche zeigt dezent „Lokal gespeichert“. Es gibt keinen separaten Speichern-Button.

### 14.3 Mehrere Tabs

Mehrere Tabs synchronisieren Änderungen über `BroadcastChannel`.

Kann ein Konflikt nicht eindeutig behandelt werden, wird der ältere Tab schreibgeschützt und fordert zum Neuladen auf. Stilles „last write wins“ ist nicht zulässig.

### 14.4 Validierung und Wiederherstellung

Lokale Daten werden bei jedem Laden gegen das aktuelle Schema validiert. Ungültige Daten werden niemals automatisch überschrieben.

Currivia hält zusätzlich den letzten gültigen lokalen Snapshot. Bei einem Fehler werden angeboten:

- Wiederherstellung des letzten gültigen Zustands
- Rohdaten-Export zur Diagnose
- vollständiges Löschen

### 14.5 Datenlöschung

„Alle lokalen Daten löschen“ verwendet einen zweistufigen Dialog:

1. klare Zusammenfassung und Angebot eines Exports
2. ausdrückliche unwiderrufliche Bestätigung

Ein Bestätigungssatz muss nicht abgetippt werden.

### 14.6 Sicherungserinnerung

Currivia erinnert an einen Export:

- einmal nach abgeschlossener Ersterfassung
- danach höchstens alle 30 Tage, wenn tatsächliche Änderungen vorliegen

Der Hinweis ist wegklickbar, bleibt lokal und erzeugt keine externe Benachrichtigung.

## 15. Export und Import

### 15.1 Exportinhalt

Ein Export enthält:

- persönliche Daten
- `schemaVersion`
- `regulationVersion`
- `sourceRevision`
- relevante Erstellungs- und Diagnosemetadaten

Er enthält keine ausführbare oder maßgebliche offizielle Regelkonfiguration.

### 15.2 Sensibilität

Exportdateien sind unverschlüsselte JSON-Dateien. Vor dem Download weist Currivia darauf hin, dass sie sensible Studien- und Notendaten enthalten können.

Passwortverschlüsselte Exporte gehören nicht zum MVP.

### 15.3 Manueller JSON-Edit

Nutzer dürfen eine Exportdatei technisch bearbeiten und erneut importieren. Dies geschieht auf eigene Verantwortung.

Currivia:

- validiert strikt,
- zeigt eine Zusammenfassung,
- übernimmt nur persönliche Datenfelder und
- lässt keine Änderung der offiziellen Regeln über den Import zu.

### 15.4 Importverhalten

Import ersetzt den vorhandenen Plan vollständig. Ein Merge wird nicht angeboten.

Vor dem Ersetzen:

- wird der vorhandene Plan zusammengefasst,
- wird ein Sicherungsexport empfohlen und
- muss der Nutzer den Ersatz bestätigen.

Es gibt keinen Teilimport.

### 15.5 Importgrenzen

Grenzen des MVP:

- maximal 1 MB pro JSON-Datei
- höchstens 30 Semester
- höchstens 1.000 eigene Module
- höchstens 5.000 Versuche

Unbekannte Felder, unbekannte zukünftige Schema-Versionen oder überschrittene Grenzen führen zu einer verständlichen Ablehnung ohne Datenänderung.

### 15.6 Migrationen

Jede veröffentlichte `0.x`-Version erhält eine getestete schrittweise Migration zum aktuellen Format.

Unbekannte zukünftige Versionen werden abgelehnt. Vor `1.0` kann die langfristige Garantie mit einem angekündigten Migrationswerkzeug neu bewertet werden.

## 16. Datenschutz und Sicherheit

### 16.1 Datenminimierung

Currivia fragt nicht nach und speichert nicht:

- Name
- Geburtsdatum
- Geburtsort
- Matrikelnummer
- Hochschul-Login

Noten bleiben optional.

### 16.2 Keine externe Übertragung

Im MVP gibt es:

- kein Backend
- keine Benutzerkonten
- keine Analytics
- keine Werbe-SDKs
- keine externen Fonts
- keine CDNs
- keine eingebetteten Drittinhalte
- keine automatische Fehlerübertragung

Alle Schriften, Icons und Assets werden im Build gebündelt.

### 16.3 Import-Sicherheit

JSON-Import:

- wird vor jeder Verarbeitung validiert,
- besitzt Größen- und Mengengrenzen,
- führt niemals enthaltenen Code aus,
- akzeptiert kein HTML als ausführbaren Inhalt und
- verändert bei einem Fehler keine lokalen Daten.

### 16.4 Öffentliche Testdaten

Echte Leistungsübersichten und persönliche Exporte dürfen nicht in das Repository aufgenommen werden.

Tests verwenden ausschließlich synthetische Daten, die nötige Strukturen abbilden, darunter:

- `AN`
- `BE`
- `NB`
- `EN`
- `RT`
- Prüfungsbestandteile
- Wiederholungen
- unvollständige Verläufe

### 16.5 Feedback und sensible Daten

Das öffentliche Issue-Formular fragt ausschließlich nach:

- Regel-ID
- App-Version
- abstrakter Fehlerbeschreibung
- nicht personenbezogener Diagnose

Direkt am Eingabefeld wird davor gewarnt, Leistungsübersichten, Noten oder Exporte hochzuladen.

Für sensible Sicherheitsfälle existiert ein privater Kontaktweg.

### 16.6 Betreiberinformation

Der Projektverantwortliche beziehungsweise sein öffentliches GitHub-Profil wird als Kontakt benannt. Vor Entfernung von `noindex` werden Datenschutz-, Hosting- und Anbieterinformationen anhand des tatsächlichen Betriebs geprüft und veröffentlicht.

## 17. Barrierefreiheit

WCAG 2.2 AA ist verbindliches Qualitätsziel.

Pflichtanforderungen:

- vollständige Tastaturbedienung
- sichtbarer Fokus
- ausreichende Kontraste
- verständliche Statusmeldungen
- keine reine Farbcodierung
- ausreichend große Interaktionsflächen
- semantische Struktur
- Drag-and-drop niemals als einziger Weg
- Unterstützung von Zoom und reduzierter Bewegung

Prüfung:

- automatisierte `axe`-Checks für Kernansichten
- manuelle Tastaturtests
- manuelle Zoom- und Kontrastprüfung
- mindestens ein Screenreader-Test mit VoiceOver oder NVDA
- Pilotaufgabe „Modul ohne Drag-and-drop verschieben“

## 18. Visuelles und sprachliches Design

### 18.1 Erscheinungsbild

Currivia wirkt:

- ruhig
- modern
- vertrauenswürdig
- sachlich
- nicht wie ein offizielles Hochschulportal

Nicht vorgesehen:

- Gamification
- Konfetti
- künstliche Optimierungs- oder Leistungs-Scores
- HdM-Logo
- visuelle Behauptung offizieller Trägerschaft

Das MVP verwendet ein hochwertiges helles Theme. Dark Mode folgt frühestens nach dem Pilot.

### 18.2 Branding

Verbindlicher Produktname:

> Currivia – Studienverlaufsplaner

Sachliche Unterzeile:

> Pilotkonfiguration für Medieninformatik an der HdM

Nicht verwendet werden Formulierungen wie „HdM Currivia“, die eine offizielle Trägerschaft suggerieren könnten.

### 18.3 Sprache

Die MVP-Oberfläche ist ausschließlich deutschsprachig. Curriculumsdaten dürfen optionale englische Modulnamen enthalten.

Texte werden zentral verwaltet und nicht unkontrolliert in Komponenten verteilt.

### 18.4 Fortschrittsdarstellung

Fortschritt wird primär hierarchisch gezeigt:

- Grundstudium
- Pflicht-Hauptstudium
- Wahlpflicht
- Praxissemester
- Bachelorarbeit

Ein ergänzender Gesamtwert `bestandene ECTS / 210` ist erlaubt. Ein einzelner vermeintlich präziser Prozentwert „Studium abgeschlossen“ ist nicht die primäre Darstellung.

### 18.5 Glossar

Begriffe werden kontextbezogen erklärt, insbesondere:

- Grundstudium
- Wahlpflicht
- Zwischenprüfung
- Fachsemester
- Rücktritt
- nicht prüfbar
- Ist-Zustand
- Prognose

Eine kompakte Glossarübersicht bündelt diese Erklärungen.

## 19. Informationsarchitektur

Kernansichten des MVP:

1. Landingpage mit Produktgrenzen
2. Onboarding und SPO-Bestätigung
3. Erfassungsassistent
4. Semesterplan
5. Modul- und Prüfungsbestandteildetails
6. Modul-/Wahlpflichtkatalog
7. Prüfansicht mit Anforderungen, Regeln und Quellen
8. Einstellungen, Export, Import und Datenlöschung
9. Demo-Modus
10. Hilfe, Glossar, Datenschutz und Projektinformationen

Module und Regeln besitzen stabile, nicht personenbezogene Direktlinks, beispielsweise:

```text
#/modules/<module-id>
#/rules/<rule-id>
```

Wegen GitHub Pages verwendet der MVP Hash-Routing. Persönliche Planstände erscheinen niemals in URLs.

## 20. Technische Architektur

### 20.1 Repository-Struktur

Verbindliche minimale Monorepo-Struktur:

```text
apps/
  web/
packages/
  rules/
  schema/
curricula/
  hdm/
    mi7/
      sose2025/
docs/
  product/
  architecture/
  decisions/
.github/
  workflows/
  ISSUE_TEMPLATE/
```

Es werden keine zusätzlichen Pakete ohne konkreten Bedarf angelegt.

### 20.2 Toolchain

- React
- TypeScript
- Vite
- pnpm Workspaces
- Zod als ausführbare Schemaquelle
- IndexedDB über das kleine `idb`-Paket
- React `useReducer` und Context für den aktiven Plan
- Vitest
- Playwright
- CSS Modules
- zentrale CSS Custom Properties als Design-Tokens

Node- und pnpm-Version werden im Repository fixiert. Eine Python-/`uv`-Toolchain wird nicht verpflichtend eingeführt, solange kein konkreter Python-Anwendungsfall entsteht.

### 20.3 State und Persistenz

Der aktive Plan wird mit React `useReducer` und Context verwaltet. Es gibt keine zusätzliche globale State-Bibliothek.

IndexedDB liegt hinter einem Repository-Interface. Regel- und Domänentests laufen ohne Browser und ohne React.

### 20.4 Schema

Zod ist die einzige ausführbare Quelle der Wahrheit für:

- persönliche Daten
- Exporte und Importe
- Curriculumsdaten
- Regelkonfiguration

TypeScript-Typen werden aus Zod abgeleitet. Ein JSON Schema kann später für Community-Werkzeuge generiert werden; es wird nicht parallel manuell gepflegt.

### 20.5 UI-Komponenten

Native HTML-Elemente werden bevorzugt. Für wenige komplexe Interaktionen darf eine etablierte barrierefreie Headless-Bibliothek eingesetzt werden.

Es gibt keine umfassende visuelle UI-Suite und kein großes UI-Framework.

### 20.6 Fehlerisolation

Eine einzelne nicht auswertbare Regel darf die App nicht unbenutzbar machen.

Eine ungültige gebündelte SPO-Konfiguration ist strenger:

- der Release-Build scheitert in CI,
- bei einem unerwarteten Laufzeitfehler startet kein Planner mit Teilregeln,
- stattdessen erscheint eine sichere Fehlerseite mit Diagnose und Exportmöglichkeit.

## 21. Wartungs-CLI

Das Repository enthält eine kleine interne CLI mit drei Kernbefehlen:

```text
validate
diff
review-report
```

Aufgaben:

- Konfigurationen und Referenzen validieren
- fachlich relevante Änderungen zwischen Revisionen zeigen
- fehlende Quellen, Tests und Prüfungen auflisten

Die CLI veröffentlicht oder verändert Regeln niemals automatisch.

## 22. Tests und Qualitätssicherung

Es gibt keine pauschale Testabdeckungsquote als primäres Qualitätsziel.

Verbindlich sind:

- jede aktive Regel mit positivem Fall
- jede aktive Regel mit negativem Fall
- jede aktive Regel mit `nicht prüfbar`-Fall
- jede belegte Grenzbedingung
- Schema- und Konsistenztests
- Migrationstests
- Tests gegen unbeabsichtigte Doppelanrechnung
- Tests für widersprüchliche persönliche und offizielle Zuordnungen
- Tests für alle SELMA-Status
- Tests für Prüfungsbestandteile und semesterübergreifende Wiederholungen

Kritische End-to-End-Wege:

1. Onboarding und SPO-Bestätigung
2. Erfassung vergangener Leistungen
3. Planung und Verschieben eines Moduls
4. Verschieben ohne Drag-and-drop
5. Anzeigen eines Regelhinweises und seiner Quelle
6. Trennung von Ist-Zustand und Prognose
7. Export
8. vollständiger Importersatz
9. Wiederherstellung nach ungültigen Daten
10. Löschen aller lokalen Daten

## 23. CI, Git und Releases

### 23.1 Merge-Schutz

Auch bei Solo-Entwicklung läuft jede Änderung über einen Pull Request. Es gibt keine direkten Änderungen an `main`.

Jeder PR benötigt:

- ein Issue oder klar dokumentiertes Ziel
- Akzeptanzkriterien
- grüne CI
- nachvollziehbaren Scope

Curriculums- und Regeländerungen benötigen zusätzlich Quelle, neue Tests und die vereinbarte Prüfung.

### 23.2 Blockierende CI-Prüfungen

- Formatprüfung
- Lint
- TypeScript
- Zod-Schema- und Konsistenztests
- Unit-Tests
- Produktionsbuild
- kritische Playwright-Wege

Dependency-Audits informieren. Sie blockieren nur bei konkret bewerteten relevanten Risiken.

### 23.3 Deployment

Die Alpha wird über GitHub Pages veröffentlicht.

GitHub Pages aktualisiert sich nicht bei jedem Merge auf `main`, sondern nur aus einem versionierten Release-Tag. Pull Requests bauen und testen, veröffentlichen aber keine produktive Regeländerung.

### 23.4 Versionsnamen

Alpha-Versionen werden fortlaufend benannt:

```text
v0.1.0-alpha.1
v0.1.0-alpha.2
v0.1.0-alpha.3
```

Die nach bestandenem Pilot veröffentlichte Version erhält einfach die nächste laufende Nummer. Es gibt keinen Rücksprung auf `v0.1.0-alpha`, da diese Version in SemVer älter als `alpha.1` wäre.

## 24. Browser und Laufzeit

Offiziell unterstützt werden:

- die jeweils zwei aktuellen Hauptversionen von Chrome
- die jeweils zwei aktuellen Hauptversionen von Firefox
- die jeweils zwei aktuellen Hauptversionen von Safari
- die jeweils zwei aktuellen Hauptversionen von Edge
- aktuelle Mobile-Versionen von Safari und Chrome für die grundlegenden Wege

Nicht unterstützt werden:

- alte Browser
- eingebettete In-App-Browser
- installierbare PWA und vollständiger Offline-Betrieb im MVP

Persönliche Daten bleiben local-first. Zum initialen Laden der statischen App ist Internet erforderlich.

## 25. Feedback und Pilot

### 25.1 Teilnehmer

Der Pilot benötigt:

- zwei moderierte Sitzungen mit lautem Denken
- anschließend mindestens fünf unmoderierte Nutzer mit identischen Aufgaben

Die unmoderierten Nutzer dürfen nicht durch vorherige Moderation bereits mit den Lösungen vertraut sein.

Alle Teilnehmer gehören zur unterstützten Regelgeneration oder testen ausdrücklich nur den synthetischen Demo-Modus für allgemeine UX-Fragen.

### 25.2 Pilotaufgaben

Jeder unmoderierte Tester soll:

1. die geltende SPO bestätigen
2. den bisherigen Verlauf erfassen
3. die restlichen Semester grob planen
4. mindestens eine offene Anforderung erkennen
5. ein Modul ohne Drag-and-drop verschieben
6. Ist-Zustand und Prognose unterscheiden
7. eine Regelquelle öffnen
8. exportieren
9. den Plan erfolgreich wiederherstellen

### 25.3 Erhobene Daten

Erfasst werden:

- Aufgabenerfolg
- benötigte Zeit
- Fehlinterpretationen
- Regel- und Softwarefehler
- subjektiver Nutzen
- Vertrauen in die Hinweise
- Verständnis von Ist, Prognose und Unverbindlichkeit

Nicht erfasst werden:

- Namen in der Auswertung
- Noten
- Matrikelnummern
- exportierte Pläne
- individuelle Leistungsdaten

Tester dürfen echte Verläufe verwenden, Noten auslassen und sensible Module oder Versuche nicht zeigen.

### 25.4 Pilotfeedback und Issues

GitHub-Issues dienen konkreten Software- und Regelfehlern. Das eigentliche Pilotfeedback wird in einem einheitlichen anonymisierten Beobachtungsbogen erfasst.

Nur anonymisierte Ergebnisse werden dauerhaft behalten. Personenbeziehbare Rohnotizen werden nach Auswertung und Freigabe des zusammengefassten Berichts gelöscht.

### 25.5 Öffentlicher Pilotbericht

Ein knapper aggregierter Bericht wird im Repository veröffentlicht. Er enthält:

- Aufgaben
- Stichprobengröße
- Ergebnisse
- gefundene Probleme
- daraus abgeleitete Änderungen
- Grenzen der Untersuchung

Er enthält keine Namen, nicht freigegebenen Zitate oder individuellen Leistungsdaten.

Das Release erfolgt nicht automatisch an einem bestimmten Kalendertag.

## 27. Veröffentlichung und Auffindbarkeit

Während des Piloten ist die Anwendung technisch öffentlich über einen direkten Link erreichbar, wird aber:

- nicht aktiv beworben
- mit `noindex` gekennzeichnet
- deutlich als Alpha-Pilot bezeichnet

Nach bestandenem Go/No-Go werden Auffindbarkeit und Hinweise bewusst neu gesetzt.

## 28. Wartungsprozess

### 28.1 Erkennung neuer Quellen

Neue SPO- oder Modulhandbuchfassungen werden erkannt durch:

- einen manuellen dokumentierten Check vor jedem Semesterstart
- Meldungen über ein GitHub-Issue-Formular

Es gibt kein automatisches Scraping im MVP.

### 28.2 Revisionsablauf

1. Neue Fassung als Prüfticket erfassen
2. Relevanz für `mi7-sose2025` prüfen
3. Maschinellen Diff erzeugen
4. Betroffene Fakten und Regeln identifizieren
5. Quellen und Auszüge aktualisieren
6. Betroffene Prüfstatus zurücksetzen
7. Schema-, Konsistenz- und Szenariotests ausführen
8. Zweitprüfung durchführen
9. Neue `sourceRevision` in einen Release aufnehmen
10. Änderungen für Nutzer dokumentieren

### 28.3 Akzeptabler Pflegeaufwand

- Neue Gesamt-SPO ohne relevante MI-Änderung: höchstens zwei Stunden für Prüfung und Dokumentation
- Tatsächliche Regelrevision: höchstens ein Arbeitstag zuzüglich Zweitprüfung

Wird diese Grenze bei zwei aufeinanderfolgenden Revisionen deutlich überschritten, werden Scope oder Fortführung neu bewertet.

## 29. Nicht im MVP

- weitere Studiengänge oder SPO-Generationen
- Cloud-Synchronisierung
- Benutzerkonten
- Backend
- SELMA-, Moodle- oder Hochschul-Login
- automatischer PDF-Import von Leistungsübersichten
- automatisches Scraping
- automatischer SPO-Parser
- KI-Chat oder KI-Regelentscheidungen
- Notendurchschnitt oder Abschlussnotenprognose
- mehrere parallele Planungsszenarien
- automatische Stundenplan- und Überschneidungsprüfung
- automatische Veranstaltungs- oder Fristdaten
- Browser-Benachrichtigungen
- PWA und garantierter Offline-Betrieb
- Dark Mode
- mehrere lokale Profile
- öffentliche Share-Links
- verschlüsselte Exportdateien
- HdM-Logo oder offizielle Kennzeichnung
- allgemeine Belastungs- oder Optimierungsscores
- automatische Modulpriorisierung

## 30. Demo-Modus

Der Demo-Modus:

- verwendet ausschließlich synthetische Daten
- ist schreibgeschützt
- persistiert keinen persönlichen Plan
- ist klar als Demonstration gekennzeichnet
- erzeugt keine auf den Besucher bezogene Regelaussage

Er ermöglicht Portfolio- und Projektbewertung, ohne die SPO-Bestätigung zu umgehen.

## 31. Schlankes Specification Gate

Das Specification Gate ist ein kurzer Qualitätscheck zwischen Shared Understanding und Vertical-Slice-Planung. Es ist keine horizontale Vorentwicklungsphase, in der sämtliche Schemas, Screens oder Engine-Bausteine fertiggestellt werden.

Vor dem ersten produktiven Slice müssen lediglich folgende Grundlagen belastbar sein:

1. diese verbindliche Produktspezifikation
2. ein Quelleninventar für den ersten Slice
3. repräsentative Designproben für die riskantesten Regelformen:
   - ECTS-Summe
   - Voraussetzung
   - Vorleistung innerhalb eines Moduls
   - Kopplung oder Ausschluss
   - maximale Auswahl
4. Architecture Decision Records für die unmittelbar irreversiblen Entscheidungen:
   - Trennung offizieller und persönlicher Daten
   - Modul-/Komponenten-/Versuchsmodell
   - deklarative Regeln und Versionierung
5. eine grobe Slice Map für die vollständige MVP-Abdeckung
6. ein detaillierter Plan ausschließlich für den nächsten Slice mit:
   - Nutzerergebnis
   - Akzeptanzkriterien
   - betroffenen Quellen
   - kleinem UI-Entwurf
   - Daten- und Schnittstellenänderungen
   - Test- und Verifikationsplan

Vollständige Produktionsschemas, alle Wireframes und sämtliche Regeln werden nicht vorab horizontal ausgearbeitet. Sie entstehen kontrolliert in den Slices, in denen sie erstmals gebraucht werden. Globale Invarianten aus dieser Spezifikation bleiben dabei verbindlich.

Das Gate ist bestanden, wenn der erste Slice ohne ungeklärte fachliche oder architektonische Annahme implementiert werden kann und sein Erfolg objektiv prüfbar ist.

## 32. Umsetzung in vertikalen Slices

Currivia wird nicht schichtweise als „erst Engine, dann UI, dann Persistenz“ entwickelt. Jeder Slice liefert einen kleinen, demonstrierbaren Nutzerweg durch alle benötigten Schichten:

```text
offizielle Quelle
    → Konfiguration und Schema
    → Domänen- und Regelverhalten
    → lokale Persistenz
    → Benutzeroberfläche
    → automatisierte und manuelle Verifikation
```

Die verbindliche Slice Map, das Kanban-Modell und die Planungsregeln stehen in [delivery-plan.de.md](./delivery-plan.de.md).

Grundsätze:

- Ein Slice dauert idealerweise höchstens ein bis zwei konzentrierte Arbeitstage.
- Es befindet sich immer nur ein Feature-Slice in Umsetzung.
- Jeder Slice ist nach Abschluss lokal demonstrierbar und grundsätzlich releasefähig.
- Tests, Quellen, Sicherheit und Accessibility gehören in jeden Slice.
- Nur der nächste Slice wird vollständig detailliert; spätere Slices bleiben bewusst grob.
- Ein horizontaler Technik-Task ist nur zulässig, wenn er unmittelbar innerhalb eines Nutzer-Slices benötigt wird oder als zeitlich begrenzter, ausdrücklich nicht produktiver Spike eine konkrete Unsicherheit beantwortet.
- Nach jedem Slice folgen menschliche Abnahme, Recap, kleinster sinnvoller Refactor und ein kleiner Pull Request.

## 33. Offene Arbeit, aber keine offenen Produktentscheidungen

Der MVP-Scope ist entschieden. Vor der Implementierung fehlen noch ausführende Arbeiten:

- offizielle Quellen vollständig inventarisieren
- jede Mindestregel mit genauer Fundstelle belegen
- Modul- und Prüfungsbestandteilkatalog erstellen
- die Mathematik-Vorleistungsregel offiziell verifizieren
- synthetische Testfälle erstellen
- Wireframes anfertigen
- Backlog und ADRs schreiben
- Betreiber-, Datenschutz- und Hostingtexte vor Veröffentlichung rechtlich prüfen

Diese Punkte sind keine Einladung zu zusätzlichem Scope. Wenn eine Regel nicht eindeutig belegt werden kann, wird sie sichtbar als „noch nicht geprüft“ behandelt.

## 34. Definition of Done des MVP

Currivia ist als MVP fertig, wenn:

- die unterstützte Zielgruppe eindeutig begrenzt ist,
- persönliche Daten ausschließlich lokal bleiben,
- die Mindestregeln korrekt, belegt und getestet sind,
- alle Ergebnisse ihre Version und Quelle zeigen,
- fehlende Daten nicht als Verstoß erscheinen,
- Ist-Zustand und Prognose nicht verwechselt werden können,
- der Plan per Tastatur vollständig bedienbar ist,
- Export, Import, Migration, Wiederherstellung und Löschung sicher funktionieren,
- der Pilot die Go/No-Go-Kriterien erfüllt,
- bekannte Grenzen prominent dokumentiert sind und
- der veröffentlichte Build exakt einem nachvollziehbaren Release entspricht.
