# Currivia: Projektstatus und Chat-Handoff

**Stand:** 19. August 2026
**Aktuelle Phase:** S2 in Review
**Aktiver Slice:** [S2 – Bestehenden Studienverlauf korrekt erfassen](../slices/s2-study-history.de.md)
**GitHub-Issue:** [#3](https://github.com/anasalkaisi/currivia/issues/3)
**Branch:** `codex/s2-study-history`

## Zweck

Diese Datei ist der kurze Einstieg für eine neue Arbeitssitzung. Sie ersetzt weder Produktspezifikation noch Delivery-Plan, sondern verweist auf den aktuell verbindlichen Kontext. Sie wird bei jedem Slice- oder Phasenwechsel aktualisiert.

## Aktueller Stand

- MVP-Scope und fachliche Invarianten sind festgelegt.
- Der gesamte MVP ist grob als S1–S7 plus Release-Gate R1 geschnitten.
- S1 ist über Pull Request [#2](https://github.com/anasalkaisi/currivia/pull/2) gemergt; S2 ist detailliert und implementiert.
- Die offiziellen S1-Fakten sind anhand der HdM-SPO und des archivierten Modulhandbuchs dokumentiert.
- Drei grundlegende Architekturentscheidungen und fünf Regel-Designproben liegen vor.
- S2 ist auf `codex/s2-study-history` vollständig implementiert und für den Review vorbereitet.
- Formatierung, Linting, Typprüfung, Produktionsbuild, 31 Unit-/Integrationstests und 4 Browser-End-to-End-Tests sind grün.
- Der S2-Nutzerweg wurde auf Desktop und Mobil geprüft; die menschliche Abnahme ist noch offen.
- Eine unabhängige Zweitprüfung der offiziellen Quellen bleibt Bestandteil der späteren Abnahme.

## Verbindliche Lesereihenfolge für die nächste Sitzung

1. diese Datei
2. [MVP-Spezifikation](./mvp-specification.de.md), besonders Abschnitte 31–33
3. [Delivery-Plan](./delivery-plan.de.md), besonders Planungshorizont, Ready-Gate und Ablauf pro Slice
4. [S2-Spezifikation](../slices/s2-study-history.de.md)
5. [S2-Recap](../slices/s2-recap.de.md)
6. [S1-Spezifikation und Quellenpaket](../slices/s1-ects-walking-skeleton.de.md)
7. [ADR 0001](../decisions/0001-official-and-personal-data.md), [ADR 0002](../decisions/0002-module-component-attempt-model.md) und [ADR 0003](../decisions/0003-declarative-rules-and-versioning.md)
8. [Regel-Designproben](../architecture/rule-design-probes.de.md)

Die übrigen Teile der langen MVP-Spezifikation werden bei Bedarf gelesen; der neue Chat soll sie nicht ungeprüft neu interpretieren.

## Nächste Aktion

1. S2 fachlich und visuell menschlich abnehmen.
2. Die unabhängige Zweitprüfung der offiziellen Quellen abschließen.
3. Draft-PR des S2-Branches prüfen und Review-Funde beheben.
4. S2 mergen.

## Nicht tun

- S3 oder spätere Slices implementierungsreif ausplanen
- die vollständige Regel-Engine vorab bauen
- den vollständigen Modulkatalog ergänzen
- S1 oder S2 öffentlich als vollständigen Studienplan darstellen
- persönliche Echtdaten in Code, Fixtures, Logs oder Issues übernehmen
- neue Produktentscheidungen ausschließlich im Issue verstecken

## Startsatz für einen neuen Chat

> Lies `docs/product/current-state.de.md` und den dort verlinkten verbindlichen Kontext. Reviewe anschließend S2 auf `codex/s2-study-history`, prüfe besonders Statussemantik, Migration und Erfassungsassistent und beginne noch nicht mit S3.
