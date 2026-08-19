# ADR 0003: Begrenzte deklarative Regeln und getrennte Versionierung

**Status:** Accepted
**Datum:** 19. August 2026

## Kontext

Studienregeln müssen quellenbasiert, testbar und aus Community-Konfigurationen sicher auswertbar sein. Frei ausführbarer Konfigurationscode wäre schwer prüfbar und ein Sicherheitsrisiko. App, persönliches Datenformat und SPO-Quellen ändern sich außerdem unabhängig voneinander.

## Entscheidung

Regeln werden als begrenzte deklarative Strukturen aus fest implementierten, getesteten Operatoren beschrieben. Es gibt weder `eval` noch freie Ausdrücke oder dynamisch geladenen Regelcode.

Getrennte Versionsachsen:

- `appVersion`: SemVer der Anwendung
- `schemaVersion`: ganzzahlige Version persönlicher Daten
- `regulationVersion`: fachliche Regelgeneration
- `sourceRevision`: geprüfter Quellenstand einer Regelgeneration

S1 führt nur den Operator `sumCredits` ein. Weitere Operatoren werden erst in dem Slice produktiv implementiert, der sie benötigt.

## Konsequenzen

- Neue Regelarten erfordern eine überprüfbare Engine-Änderung.
- Eine neue Quellenrevision kann ohne Änderung persönlicher Daten ausgewertet werden.
- Curriculumsänderungen bleiben per Schema und Tests kontrollierbar.
- Ein Operator wird nicht spekulativ implementiert, nur weil er in späteren Slices vorkommen könnte.
