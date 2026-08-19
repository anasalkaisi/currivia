# Designproben für die deklarative Regel-Engine

**Stand:** 19. August 2026
**Status:** Gate-Artefakt, kein finales Produktionsschema

## Zweck

Diese Proben prüfen vor S1, ob die geplante begrenzte Regelsprache die bereits bekannten Risikoklassen grundsätzlich ausdrücken kann. Sie frieren weder JSON-Feldnamen noch die vollständige DSL ein.

Produktiv implementiert wird jeweils nur der Operator, den der aktuelle Slice benötigt.

## Probe 1: ECTS-Summe

```json
{
  "operator": "sumCredits",
  "where": { "area": "all" },
  "targetHundredths": 21000,
  "creditStatus": "passed"
}
```

Erforderliche Fälle:

- kein bestandenes Modul → `unsatisfied`, Istwert 0
- Web Development bestanden → `unsatisfied`, Istwert 500
- Ziel erreicht → `satisfied`
- widersprüchlicher Modulstatus → `unknown`

## Probe 2: Vorherige Voraussetzung

```json
{
  "operator": "mustPassBefore",
  "required": { "moduleId": "example-prerequisite" },
  "subject": { "itemId": "example-subject" },
  "at": "subjectSemesterStart"
}
```

Die Auswertung muss Ist-Zustand, Prognose und Stichtag unterscheiden.

## Probe 3: Vorleistung innerhalb eines Moduls

```json
{
  "operator": "mustPassBefore",
  "required": {
    "moduleId": "example-module",
    "componentId": "example-pre-assessment"
  },
  "subject": {
    "moduleId": "example-module",
    "componentId": "example-exam"
  },
  "at": "attemptSemesterStart"
}
```

Die Probe bestätigt, dass Modul- und Komponentenreferenzen dieselbe Operatorfamilie verwenden können.

## Probe 4: Gemeinsame Belegung und Ausschluss

```json
{
  "operator": "allOf",
  "rules": [
    {
      "operator": "mustTakeTogether",
      "items": ["example-a", "example-b"]
    },
    {
      "operator": "mutuallyExclusive",
      "items": ["example-a", "example-c"]
    }
  ]
}
```

Die Engine muss erklären können, welche konkrete Belegung den Hinweis ausgelöst hat.

## Probe 5: Maximale Auswahl

```json
{
  "operator": "maxSelections",
  "from": ["example-lab-a", "example-lab-b", "example-lab-c"],
  "maximum": 1,
  "countStatus": ["planned", "registered", "passed"]
}
```

Ist- und Prognoseauswertung dürfen unterschiedliche Resultate erzeugen.

## Gate-Ergebnis

Die fünf bekannten Regelformen lassen sich ohne frei ausführbaren Code ausdrücken. Noch offen und absichtlich nicht vor S1 zu entscheiden sind:

- endgültige JSON-Feldnamen
- vollständige Operatorliste
- Optimierung mehrdeutiger Anrechnungen
- Lokalisierung der Textvorlagen
- Batch-Auswertung und Performance

Diese Punkte werden in den Slices entschieden, in denen ein echter Nutzerweg sie benötigt.
