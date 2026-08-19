# ADR 0002: Module, Prüfungsbestandteile und Versuche getrennt modellieren

**Status:** Accepted
**Datum:** 19. August 2026

## Kontext

Eine HdM-Leistungsübersicht kann einen übergeordneten Modulstatus und separat ausgewiesene Prüfungsbestandteile mit eigenen Versuchen und Status enthalten. Ein einzelnes Statusfeld pro Modul kann Rücktritte, Vorleistungen und Wiederholungen nicht korrekt erklären.

## Entscheidung

- Ein offizieller Curriculumsbaustein besitzt eine stabile interne ID.
- Der offizielle Modulstatus wird separat erfasst und entscheidet über die ECTS-Anrechnung.
- Ein Modul kann null oder mehrere offiziell relevante Prüfungsbestandteile besitzen.
- Ein Versuch gehört zu einem Modul oder einem konkreten Prüfungsbestandteil und zu einem Semester.
- Offizielle Versuchszahlen werden optional übernommen, niemals selbst hochgezählt.
- Planungsaktivitäten dürfen semesterübergreifend sein, ohne das Modul oder seine ECTS zu duplizieren.

S1 implementiert davon nur den einfachsten Fall: ein Modul ohne Bestandteile und ein bestandener Modulstatus. Das Datenmodell darf spätere Bestandteile jedoch nicht strukturell verhindern.

## Konsequenzen

- Die ECTS-Berechnung verwendet ausschließlich den offiziellen bestandenen Modulstatus.
- `RT` wird nicht automatisch als `NB` oder verbrauchter Versuch interpretiert.
- Unvollständige Komponentendaten dürfen den offiziellen Modulstatus nicht überschreiben.
- UI und Tests müssen Modulabschluss und Verlauf getrennt darstellen können.
