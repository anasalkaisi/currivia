# Currivia: Machbarkeitsanalyse und MVP-Entscheidung

**Stand:** 19. August 2026<br>
**Status:** Conditional Go<br>
**Erster Anwendungsfall:** Bachelor Medieninformatik an der Hochschule der Medien Stuttgart (HdM)

## Kurzentscheidung

Currivia wird als eng begrenzter, lokaler und quellenbasierter Studienverlaufsplaner umgesetzt.

Das Projekt löst ein reales Problem und eignet sich sehr gut als persönliches Werkzeug, Open-Source-Projekt und professionelles Portfolio-Projekt.

Currivia soll deshalb zunächst genau eine Medieninformatik-SPO unterstützen, persönliche Studienplanung ermöglichen und einen kleinen, vollständig getesteten Satz kritischer Studienregeln prüfen. Verlässlichkeit, Nachvollziehbarkeit und Pflegefähigkeit sind wichtiger als Funktionsmenge oder KI.

## Das Problem

Studierende müssen Informationen aus mehreren Quellen zusammenführen:

- Studien- und Prüfungsordnung (SPO)
- Modulhandbuch und Wahlpflichtangebot
- SELMA beziehungsweise Leistungsübersicht
- semesterbezogene Mitteilungen und Fristen
- eigene Semesterplanung

Tabellen können Module, Noten und ECTS erfassen, prüfen aber komplexe Regeln nur unzureichend. Bereits der untersuchte private Excel-Prototyp enthielt typische Fehlerklassen:

- unpassende Kriterien in ECTS-Formeln
- Tippfehler in Statuswerten
- auseinanderlaufende Angaben zwischen Fortschritts- und Regelübersicht
- falsche Zuordnung der Bachelorarbeit zum Studienabschnitt
- fehlende Modellierung mehrerer Sonder- und Kombinationsregeln

Currivia soll diese Fehler nicht lediglich schöner darstellen, sondern durch eine zentrale, versionierte und getestete Regelbasis vermeiden.

## Produktpositionierung

> Currivia ist ein lokaler Studienverlaufsplaner, der Studierenden zeigt, was sie abgeschlossen, geplant und noch offen haben – einschließlich nachvollziehbarer Hinweise auf Anforderungen ihrer ausgewählten SPO.

Currivia ist:

- ein persönlicher Semester- und Fortschrittsplaner
- eine nachvollziehbare, deterministische Regelprüfung
- eine interaktive Ergänzung zu StudyBuddy und SELMA
- ein Open-Source-Projekt mit versionierbaren Studiengangskonfigurationen

Currivia ist nicht:

- ein Ersatz für Prüfungsverwaltung oder Studienberatung
- eine rechtsverbindliche Entscheidungshilfe
- ein neues Campus-Management-System
- ein KI-System, das Studienregeln selbstständig erfindet
- im MVP eine Cloud-Plattform mit Nutzerkonten

## Bestehende Lösungen und Vorarbeiten

Die Grundidee ist nicht neu. Das ist kein Ausschlusskriterium, muss aber ehrlich kommuniziert werden.

### HdM StudyBuddy von 2019/20

Im Wintersemester 2019/20 entstand an der HdM ein Projekt mit Studienplaner, ECTS-Rechner, Notenspiegel und Wahlfachsuche. Die öffentlich verfügbare Darstellung wirkt wie ein UI- und Konzeptprototyp. Ein aktuell betriebener Dienst oder ein weitergepflegtes öffentliches Repository wurde nicht gefunden.

- [Projekt im HdM Stage-Archiv](https://www.hdm-stuttgart.de/stage/projekt_detail/projekt_details?projekt_ID=3164)
- [Projektpräsentation](https://hdm-stuttgart.de/stage/mediafiles/3164/sonstiges/PraesentationHdMStudyBuddy.pdf)

### Offizielles HdM StudyBuddy

Das heutige StudyBuddy-Angebot vermittelt Informationen zu Studienorganisation, SPO, Fristen und Anlaufstellen. Currivia soll dieses Angebot nicht ersetzen, sondern um persönliche Planung und maschinenlesbare Prüfungen ergänzen.

- [StudyBuddy der HdM](https://hdm-stuttgart.de/en/vor-dem-studium/vorbereitung-auf-das-studium/studybuddy/)

### Externe Vergleichssysteme

- [FlightPath](https://getflightpath.com/) zeigt, dass Studienfortschritt, Degree Audit, Voraussetzungen und Szenarioplanung eine etablierte Produktkategorie bilden.
- [Stanford MAP](https://map.stanford.edu/frequently-asked-questions-about-map) trennt abgeschlossene, laufende und offene Anforderungen und bestimmt geltende Regeln anhand des Einschreibedatums.

Currivias Differenzierung liegt nicht in der erstmaligen Erfindung eines Studienplaners, sondern in einer schlanken, transparenten, lokal nutzbaren und für deutsche SPO-Strukturen geeigneten Umsetzung.

## MVP-Umfang

### 1. Eine SPO-Konfiguration

Der MVP unterstützt ausschließlich den Bachelor Medieninformatik und die Regelgeneration, die für Einschreibungen ab Sommersemester 2025 gilt.

Eine neue semesterbezogene Gesamtfassung der HdM-SPO bedeutet nicht automatisch eine neue Medieninformatik-Regelgeneration. Deshalb werden zwei Versionen getrennt:

- `regulationVersion`, beispielsweise `mi7-sose2025`
- `sourceRevision`, beispielsweise `spo-master-sose2026`

### 2. Offizielle Module

Die Konfiguration enthält nur notwendige strukturierte Fakten:

- stabile Modul-ID
- deutsche und optionale englische Bezeichnung
- ECTS
- Modulgruppe
- Studienabschnitt
- Prüfungsart
- vorgesehene Fachsemester
- Voraussetzungen und Kombinationsregeln
- Quellenreferenz
- Prüfstatus und Prüfdatum

Vollständige SPO-Dateien und lange Modulbeschreibungen werden nicht im Repository dupliziert.

### 3. Persönlicher Studienplan

Nutzer können:

- Module als offen, geplant, angemeldet, bestanden oder nicht bestanden markieren
- ein geplantes oder tatsächliches Semester auswählen
- Module zwischen Semestern verschieben
- Versuchszahl und optionale Note erfassen
- eigene Module ergänzen

Eigene Module werden klar als persönliche Einträge markiert und erfüllen offizielle Anforderungen nicht automatisch.

### 4. Fortschrittsübersicht

Die erste Konfiguration prüft mindestens:

- 210 ECTS insgesamt
- 60 ECTS Grundstudium
- 87 ECTS Pflichtbereich Hauptstudium
- 63 ECTS Wahlpflicht
- mindestens 45 zulässige ECTS aus Medieninformatik beziehungsweise anrechenbaren Mobile-Medien-Angeboten
- Praxissemester
- Bachelorarbeit

### 5. Kritischer Regelsatz

Im MVP werden nur Regeln aufgenommen, die vollständig verstanden, belegt und getestet sind:

- Abschluss der Zwischenprüfung
- Voraussetzungen für das Praxissemester
- mindestens 70 erfolgreich erbrachte ECTS vor dem Praxissemester
- Voraussetzungen für die Bachelorarbeit
- Module, die erst nach bestandener Zwischenprüfung belegt werden dürfen
- maximale Auswahl aus bestimmten Games- und VR-Praktika
- Kopplungs- und Ausschlussregeln für Projektmitarbeit
- Studienhöchstdauer als deutlicher Hinweis

Semesterverfügbarkeit wird getrennt behandelt: Ein in der SPO vorgesehenes Fachsemester beweist nicht zwingend, dass ein Wahlmodul in einem konkreten Sommer- oder Wintersemester angeboten wird. Aktuelle Angebotsdaten benötigen eine eigene, datierte Quelle.

### 6. Nachvollziehbare Warnungen

Jede formale Warnung zeigt:

- ein klares Ergebnis
- die ausgewählte SPO-Version
- die genaue Fundstelle
- den Daten- und Prüfstand
- einen Hinweis auf offizielle Klärung bei Zweifeln

Beispiel:

> **Voraussetzung nicht erfüllt**<br>
> Nach der ausgewählten SPO fehlen noch 4 ECTS im Grundstudium.<br>
> Quelle: § 36 Abs. 6 und Tabelle 2 · Datenstand: 19.08.2026 · Im Zweifel mit der Hochschule klären.

### 7. Local-first-Datenhaltung

- keine Benutzerkonten
- kein Anwendungsbackend
- lokale Speicherung im Browser
- vollständiger JSON-Export und -Import
- Funktion zum Löschen aller lokalen Daten
- deutlicher Hinweis auf mögliche Datenverluste durch Löschen von Browserdaten

## Nicht im MVP

- Cloud-Synchronisierung
- automatisches Scraping
- automatischer SPO-Parser
- KI-Chat
- weitere Studiengänge
- Stundenplanüberschneidungen
- automatische Übernahme aktueller Veranstaltungsangebote
- personalisierte Karriere- oder Notenoptimierung
- öffentliche Share-Links für persönliche Studienpläne

## Technische Zielarchitektur

Der MVP wird als statische Webanwendung ohne Backend umgesetzt.

Empfohlener Stack:

- React und TypeScript
- Vite
- Zod oder JSON Schema für Konfigurations- und Importvalidierung
- IndexedDB für lokale Nutzerdaten
- kleine State-Lösung ohne unnötige Abstraktion
- Vitest für Regel- und Komponententests
- Playwright für kritische Nutzerwege
- statisches Hosting, beispielsweise über GitHub Pages

```text
Offizielle Quellen
      ↓
Versionierte SPO-Konfiguration
      ↓
Deterministische Regel-Engine
      ↓
Persönlicher Studienplan im Browser
```

Die Regel-Engine bleibt unabhängig von Darstellung und Speicherung. Offizielle Konfiguration und persönliche Daten werden strikt getrennt.

## Anforderungen an Regeln

Jede Regel benötigt:

- eindeutige ID
- maschinenlesbare Bedingung
- verständliche Meldung
- Quellenreferenz
- Gültigkeitsbereich
- Prüfstatus
- positive und negative Testfälle

Wichtige Konsistenztests:

- Pflicht und Wahlpflicht ergeben zusammen 210 ECTS
- das Grundstudium ergibt 60 ECTS
- alle referenzierten Modul-IDs existieren
- Voraussetzungen bilden keine unbeabsichtigten Zyklen
- Kategorien und ECTS-Grenzen widersprechen sich nicht
- jede aktive formale Regel besitzt eine Quelle
- jede Konfigurationsänderung aktualisiert ihren Prüfstand

## Pflegeprozess für neue SPO-Fassungen

Neue Regeln werden niemals automatisch veröffentlicht.

1. Neue SPO-Gesamtfassung erkennen oder melden.
2. Prüfen, ob sich der relevante Studiengangsteil tatsächlich geändert hat.
3. Maschinellen Diff zur letzten Quelle erzeugen.
4. Optional einen KI-gestützten Änderungsentwurf erstellen.
5. Jede Änderung manuell mit der amtlichen Quelle vergleichen.
6. Automatische Konsistenz- und Szenariotests ausführen.
7. Kritische Regeln durch eine zweite Person prüfen lassen.
8. Neue Konfiguration separat versionieren und veröffentlichen.

Konfigurationen erhalten einen sichtbaren Status:

- `verified`
- `community-reviewed`
- `unverified`
- `deprecated`
- `archived`

Eine nicht mehr gepflegte Konfiguration wird nicht still weiterverwendet, sondern deutlich gekennzeichnet.

## Datenschutz und Sicherheit

Diese Einschätzung ersetzt keine individuelle Rechtsberatung.

### Personenbezogene Daten

Noten und Studienverläufe können personenbezogene Daten sein. Local-first reduziert den Umfang der Datenverarbeitung durch den Betreiber erheblich, ersetzt aber keine saubere Gestaltung.

- keine Namen oder Matrikelnummern verlangen
- Noten optional machen
- keine Analytics oder Werbe-SDKs im MVP
- keine Studienplandaten an den Betreiber übertragen
- Exportdateien als potenziell sensibel kennzeichnen
- keine echten Beispielnoten oder Personendaten veröffentlichen
- kurze Datenschutz- und Hostinginformation bereitstellen

Relevante Grundsätze sind Datenminimierung, Transparenz, Richtigkeit und angemessene Sicherheit.

- [Datenschutz-Grundverordnung, insbesondere Art. 5 und 25](https://eur-lex.europa.eu/legal-content/DE-EN/ALL/?from=DE&uri=CELEX%3A32016R0679)
- [Datenerhebung bei GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

### Anwendungssicherheit

- JSON-Import nur gegen ein festes Schema
- Größen- und Komplexitätslimits für Importdateien
- kein `eval` und kein dynamisch ausgeführter Konfigurationscode
- keine ungefilterten HTML-Inhalte aus Quellen
- Dependency-Lockfile und Dependabot
- automatisierte Tests und statische Analyse
- sichere Standardwerte
- keine API-Schlüssel im Frontend
- `SECURITY.md` mit privatem Meldeweg

### Barrierefreiheit

Currivia soll WCAG 2.2 AA als Qualitätsziel verwenden. Insbesondere darf Drag-and-drop nie der einzige Weg sein, ein Modul zu verschieben.

- vollständige Tastaturbedienung
- sichtbarer Fokus
- ausreichende Kontraste
- Warnungen nicht nur durch Farbe darstellen
- verständliche Statusmeldungen
- ausreichend große Interaktionsflächen
- semantische Struktur für Screenreader

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Urheberrecht und Quelldaten

§ 5 UrhG enthält Sonderregeln für amtliche Werke. Daraus darf keine pauschale Freigabe für Modulhandbücher, redaktionelle Texte, Grafiken, Logos oder Hochschuldatenbanken abgeleitet werden.

Für den MVP gilt deshalb:

- keine vollständigen SPO-PDFs im Repository
- keine langen Modulbeschreibungen übernehmen
- nur notwendige Fakten und eigene Zusammenfassungen
- Quellenlinks und genaue Fundstellen dokumentieren
- kein HdM-Logo ohne schriftliche Zustimmung
- kein Scraping authentifizierter Moodle- oder SELMA-Inhalte
- vor größerem Ausbau die zulässige Datennutzung schriftlich mit der HdM klären

- [Urheberrechtsgesetz, insbesondere §§ 4, 5 und 87a](https://www.gesetze-im-internet.de/urhg/BJNR012730965.html)

Code, kuratierte Daten und fremde Quellen werden lizenztechnisch getrennt betrachtet. Die vorhandene Apache-2.0-Lizenz ist für den Code grundsätzlich geeignet. Bei kuratierten Konfigurationen muss dokumentiert werden, welche Teile eigene Struktur beziehungsweise Annotation und welche Teile quellenbasierte Fakten sind.

## Hostingmodell

Normale Nutzer verwenden eine öffentlich erreichbare statische Seite. Sie müssen das Repository nicht forken.

- Forks sind für Entwickler und Datenbeitragende gedacht.
- Persönliche Daten bleiben lokal im Browser.
- Nutzer können eine Sicherungsdatei exportieren.
- Die Hochschule könnte später denselben statischen Build selbst hosten.
- Cloud-Synchronisierung ist eine getrennte, optionale Ausbaustufe.

Öffentliche Share-Links nach dem Vorbild kollaborativer Whiteboards sind wegen möglicher Noten- und Verlaufsdaten nicht Bestandteil des MVP.

## KI-Ausbau

Leitprinzip:

> Die deterministische Regel-Engine entscheidet; KI erklärt und schlägt vor.

Spätere KI-Funktionen dürfen:

- Warnungen verständlich erklären
- alternative Semesterpläne vergleichen
- Fragen zu Modulen beantworten
- relevante Quellen anzeigen
- Planungsvorschläge erzeugen

Sie dürfen nicht:

- Studienregeln ohne Prüfung veröffentlichen
- rechtsverbindliche Sicherheit vortäuschen
- persönliche Daten ungefragt übertragen
- die deterministische Regelprüfung ersetzen

## Professioneller GitHub-Standard

Empfohlene Zielstruktur:

```text
apps/web/
packages/rules/
packages/schema/
curricula/hdm/mi7/sose2025/
docs/
  product/
  architecture/
  decisions/
.github/
  workflows/
  ISSUE_TEMPLATE/
  pull_request_template.md
```

Notwendige Projektdateien:

- aussagekräftige README mit Screenshot und Grenzen
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `CHANGELOG.md`
- Quellen- und Datenrichtlinie
- Issue-Formular für SPO- und Regelfehler
- Pull-Request-Template mit Quellen- und Testnachweis
- Architecture Decision Records für wichtige Entscheidungen

Arbeitsweise:

- jede Funktion beginnt mit einem Issue und Akzeptanzkriterien
- kleine Branches und Pull Requests
- keine ungeprüften KI-Dumps auf `main`
- CI prüft Build, Lint, Typen und Tests
- Regeländerungen benötigen Quelle und neue Tests
- Releases verwenden SemVer und dokumentieren Einschränkungen

Nützliche GitHub-Funktionen:

- [Issue- und Pull-Request-Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [Repository Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Dependabot-Konfiguration](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-the-dependabot-yml-file)

### AI-Slop vermeiden

- wenige, konkrete und belegte Aussagen
- reale Screenshots statt generischer Marketinggrafiken
- keine erfundenen Testimonials oder Wirkungszahlen
- bekannte Grenzen prominent anzeigen
- kleine, nachvollziehbare Commits
- jede KI-generierte Zeile verstehen und prüfen
- keine Architektur für hypothetische Anforderungen bauen

## Erfolgs- und Abbruchkriterien

### Weitermachen, wenn

- mindestens fünf Tester den Plan ohne direkte Hilfe verwenden können
- keine kritische Regel falsch berechnet wird
- Nutzer einen konkreten Mehrwert gegenüber Excel und SELMA benennen
- mindestens eine zuständige Person fachliches Interesse zeigt
- eine neue Quellenrevision ohne Änderung des Anwendungscodes abgebildet werden kann

### Scope reduzieren oder stoppen, wenn

- Datenpflege dauerhaft mehr Aufwand erzeugt als Produktnutzen
- kritische Regeln nicht zuverlässig aus offiziellen Quellen ableitbar sind
- Nutzer lediglich eine schönere Notentabelle erkennen
- das Projekt nur durch übertriebene Versprechen attraktiv erscheint

## Schlussfolgerung

Currivia ist als ehrlicher, quellenbasierter Alpha-Pilot sinnvoll. Das Projekt wird nicht durch möglichst viele Funktionen oder eine frühe KI-Integration überzeugen, sondern durch eine kleine Zahl korrekt modellierter Regeln, transparente Quellen, sichere lokale Datenhaltung, gute Nutzbarkeit und einen professionellen Pflegeprozess.

Der nächste Projektschritt ist eine konkrete Produktspezifikation mit Datenmodell, MVP-Screens, initialem Regelkatalog, Akzeptanzkriterien und priorisiertem Zehn-Tage-Backlog.
