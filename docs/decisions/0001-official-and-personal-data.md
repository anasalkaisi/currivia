# ADR 0001: Offizielle und persönliche Daten strikt trennen

**Status:** Accepted
**Datum:** 19. August 2026

## Kontext

Currivia kombiniert versionierte Studienregeln mit persönlichen Studienverläufen. Würden beide Datenarten vermischt, könnten Imports offizielle Regeln verändern, Quellrevisionen persönliche Daten überschreiben oder abgeleitete Ergebnisse veralten.

## Entscheidung

Currivia führt drei getrennte Ebenen:

1. unveränderliche, im Build gebündelte Curriculumskonfiguration
2. lokale persönliche Eingaben in IndexedDB
3. zur Laufzeit abgeleitete Fortschritts- und Regelergebnisse

Persönliche Exporte enthalten nur Versionsverweise, niemals eine maßgebliche Regelkonfiguration. Abgeleitete Ergebnisse werden neu berechnet und nicht als fachliche Wahrheit persistiert.

## Konsequenzen

- Imports können offizielle Regeln nicht verändern.
- Quellenrevisionen können persönliche Eingaben nicht still überschreiben.
- Regel- und UI-Tests können ohne Browserpersistenz laufen.
- Historische Modulreferenzen benötigen stabile interne IDs.
- Diagnose und Export müssen Schema-, Regel- und Quellenversion getrennt ausweisen.
