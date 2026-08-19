# Quellenpaket S1: MI7 SoSe 2025 und Web Development

**Stand:** 19. August 2026
**Verwendung:** Vertical Slice S1
**Regelgeneration:** `mi7-sose2025`
**Initiale Quellenrevision:** `hdm-sose2025-initial`
**Status:** selbst geprüft, noch nicht zweitgeprüft

## 1. Zweck

Dieses Quellenpaket belegt ausschließlich die Fakten, die für den ersten Walking Skeleton benötigt werden:

- Geltungsbereich der Regelgeneration
- Gesamtumfang von 210 ECTS
- Identität, Semester, ECTS und Einordnung des Moduls `113114 Web Development`
- fehlende formale Modulvoraussetzungen laut archiviertem Modulhandbuch

Es ist kein vollständiges Quelleninventar für den MVP.

## 2. Quelle Q-SPO-2025

**Dokument:** Studien- und Prüfungsordnung für siebensemestrige Bachelorstudiengänge, Sommersemester 2025
**Herausgeber:** Hochschule der Medien Stuttgart
**Offizielle Archiv-URL:** <https://hdm-stuttgart.de/media/spo/archiv/2025_2_spo_bachelor_7_sose2025_sig.pdf>
**Abrufdatum:** 19. August 2026
**Dateigröße:** 2.536.722 Bytes
**SHA-256:** `9553804700564252f32e3ad9bf4c0fd6350e6dcd3243fe6f7739e003fc58e9bf`

### Relevante Fundstellen

| Fundstelle                         | Belegter Fakt                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| § 36, gedruckte Seite 68           | Gilt für Studierende, die sich ab Sommersemester 2025 in Medieninformatik eingeschrieben haben. |
| § 36 Tabelle 1, gedruckte Seite 69 | Gesamtumfang 210 ECTS; 147 Pflicht- und 63 Wahlpflicht-ECTS.                                    |
| § 36 Tabelle 2, gedruckte Seite 70 | `113114 Web Development`, Semester 1, 4 SWS, 5 ECTS, Klausur 60 Minuten.                        |

### Kurze Belegauszüge

> Gilt für Studierende, die sich ab Sommersemester 2025 eingeschrieben haben.

> `113114 Web Development` · Semester 1 · 5 ECTS.

Die Auszüge sind bewusst kurz. Maßgeblich bleibt die verlinkte Originalquelle mit genauer Fundstelle.

## 3. Quelle Q-MHB-2025

**Archiv:** Modulhandbücher Sommersemester 2025
**Herausgeber:** Hochschule der Medien Stuttgart
**Offizielle Archiv-URL:** <https://hdm-stuttgart.de/media/content/hochschule/profil/qualitaetsmanagement/modulhandbuecher/20251_sose2025.zip>
**Abrufdatum:** 19. August 2026
**Archiv SHA-256:** `c2eaa2e5fbce8a3772b3efb7ff8dfa6225b7c10f819f90038402d279326e6d59`

**Datei im Archiv:** `550033-Medieninformatik-Bachelor-7-Semester.pdf`
**PDF SHA-256:** `9f06735ec4872754ee801447cf5f0a6e5cf83e220c26bb7e830f019f4ddac87e`

Die offizielle Archivseite erklärt, dass diese PDFs Abzüge der HdM-Webseite mit Stand der ersten Vorlesungswoche des jeweiligen Semesters sind:

<https://hdm-stuttgart.de/hochschule/profil/qualitaetsmanagement/modulhandbuecher/>

### Relevante Fundstellen im MI-PDF

| PDF-Seite | Belegter Fakt                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| 17        | `113114 Web Development`, Pflichtmodul im Grundstudium, ECTS 5/5, Klausur 60 Minuten.                             |
| 20        | Keine Voraussetzung für dieses Modul; keine Nachfolger-Voraussetzung; Lehrveranstaltung `113114a`, 4 SWS, 5 ECTS. |

### Kurze Belegauszüge

> `113114 Web Development` ist ein Pflichtmodul im Grundstudium mit 5 ECTS.

> Voraussetzung für dieses Modul: keine.

## 4. Abgeleitete S1-Fakten

| Feld                      | Wert                   | Quelle                                    |
| ------------------------- | ---------------------- | ----------------------------------------- |
| `regulationVersion`       | `mi7-sose2025`         | Q-SPO-2025, § 36 Seite 68                 |
| `sourceRevision`          | `hdm-sose2025-initial` | Currivia-ID für dieses Quellenpaket       |
| `curriculumItem.id`       | `hdm-mi7-113114`       | stabile Currivia-ID                       |
| `officialCode`            | `113114`               | Q-SPO-2025 Seite 70; Q-MHB-2025 Seite 17  |
| `title.de`                | `Web Development`      | beide Quellen                             |
| `type`                    | `module`               | beide Quellen                             |
| `area`                    | `basic-compulsory`     | Q-SPO-2025 Tabelle 2; Q-MHB-2025 Seite 17 |
| `recommendedSemester`     | `1`                    | Q-SPO-2025 Seite 70                       |
| `creditsHundredths`       | `500`                  | beide Quellen                             |
| `assessment`              | Klausur, 60 Minuten    | beide Quellen                             |
| `prerequisites`           | keine                  | Q-MHB-2025 Seite 20                       |
| `totalCreditsRequirement` | `21000`                | Q-SPO-2025 Seite 69                       |

## 5. Nicht durch dieses Paket belegt

- tatsächliche Semesterverfügbarkeit nach SoSe 2025
- vollständiger MI-Modulkatalog
- aktuelle Lehrinhalte
- alle Grundstudiums-, Pflicht- oder Wahlpflichtsummen im persönlichen Plan
- Status- und Versuchsdaten einer konkreten Person
- spätere Änderungen derselben Regelgeneration

S1 darf deshalb nicht als vollständiger oder öffentlich nutzbarer Studienplan erscheinen.

## 6. Prüfnachweis

- [x] Offizielle URLs geprüft
- [x] PDF- und Archivdateien lokal gehasht
- [x] relevante SPO-Seiten textuell und visuell geprüft
- [x] relevante Modulhandbuchseiten textuell und visuell geprüft
- [x] SPO und Modulhandbuch stimmen für Modulcode, Semester, ECTS und Prüfungsform überein
- [ ] unabhängige Zweitprüfung durchgeführt
