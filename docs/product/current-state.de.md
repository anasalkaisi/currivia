# Currivia: Projektstatus und Chat-Handoff

**Stand:** 19. August 2026
**Aktuelle Phase:** S1 in Review
**Aktiver Slice:** [S1 – Quellenbelegter ECTS-Walking-Skeleton](../slices/s1-ects-walking-skeleton.de.md)
**GitHub-Issue:** [#1](https://github.com/anasalkaisi/currivia/issues/1)

## Zweck

Diese Datei ist der kurze Einstieg für eine neue Arbeitssitzung. Sie ersetzt weder Produktspezifikation noch Delivery-Plan, sondern verweist auf den aktuell verbindlichen Kontext. Sie wird bei jedem Slice- oder Phasenwechsel aktualisiert.

## Aktueller Stand

- MVP-Scope und fachliche Invarianten sind festgelegt.
- Der gesamte MVP ist grob als S1–S7 plus Release-Gate R1 geschnitten.
- Nur S1 ist vollständig detailliert und durch den Menschen fachlich bestätigt.
- Die offiziellen S1-Fakten sind anhand der HdM-SPO und des archivierten Modulhandbuchs dokumentiert.
- Drei grundlegende Architekturentscheidungen und fünf Regel-Designproben liegen vor.
- S1 ist auf `codex/s1-ects-walking-skeleton` vollständig implementiert und für den Review vorbereitet.
- Formatierung, Linting, Typprüfung, Produktionsbuild, 15 Unit-/Integrationstests und 2 Browser-End-to-End-Tests sind grün.
- Der vollständige Nutzerweg wurde auf Desktop und Mobil geprüft und am 19. August 2026 fachlich/visuell bestätigt.
- Eine unabhängige Zweitprüfung der offiziellen Quellen bleibt Bestandteil der späteren Abnahme.

## Verbindliche Lesereihenfolge für die nächste Sitzung

1. diese Datei
2. [MVP-Spezifikation](./mvp-specification.de.md), besonders Abschnitte 31–33
3. [Delivery-Plan](./delivery-plan.de.md), besonders Planungshorizont, Ready-Gate und Ablauf pro Slice
4. [S1-Spezifikation](../slices/s1-ects-walking-skeleton.de.md)
5. [S1-Recap](../slices/s1-recap.de.md)
6. [S1-Quellenpaket](../sources/hdm-mi7-sose2025-s1.de.md)
7. [ADR 0001](../decisions/0001-official-and-personal-data.md), [ADR 0002](../decisions/0002-module-component-attempt-model.md) und [ADR 0003](../decisions/0003-declarative-rules-and-versioning.md)
8. [Regel-Designproben](../architecture/rule-design-probes.de.md)

Die übrigen Teile der langen MVP-Spezifikation werden bei Bedarf gelesen; der neue Chat soll sie nicht ungeprüft neu interpretieren.

## Nächste Aktion

1. Draft-PR zu Issue #1 prüfen.
2. Die unabhängige Zweitprüfung der offiziellen Quellen abschließen.
3. Review-Funde innerhalb des S1-Scopes beheben und S1 mergen.
4. Erst nach Merge S2 detaillieren.

## Nicht tun

- S2 oder spätere Slices implementierungsreif ausplanen
- die vollständige Regel-Engine vorab bauen
- den vollständigen Modulkatalog ergänzen
- S1 öffentlich als vollständigen Studienplan darstellen
- persönliche Echtdaten in Code, Fixtures, Logs oder Issues übernehmen
- neue Produktentscheidungen ausschließlich im Issue verstecken

## Startsatz für einen neuen Chat

> Lies `docs/product/current-state.de.md` und den dort verlinkten verbindlichen Kontext. Reviewe anschließend S1 aus GitHub-Issue #1. Halte den Scope strikt ein, schließe die unabhängige Quellen-Zweitprüfung ab und beginne noch nicht mit S2.
