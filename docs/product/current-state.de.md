# Currivia: Projektstatus und Chat-Handoff

**Stand:** 22. August 2026
**Aktuelle Phase:** S3 gemergt, Recap offen
**Aktiver Slice:** [S3 – Semester planen und Prognose verstehen](../slices/s3-recap.de.md)
**GitHub-Issue:** [#5](https://github.com/anasalkaisi/currivia/issues/5)
**Branch:** `main`

## Zweck

Diese Datei ist der kurze Einstieg für eine neue Arbeitssitzung. Sie ersetzt weder Produktspezifikation noch Delivery-Plan, sondern verweist auf den aktuell verbindlichen Kontext. Sie wird bei jedem Slice- oder Phasenwechsel aktualisiert.

## Aktueller Stand

- MVP-Scope und fachliche Invarianten sind festgelegt.
- Der gesamte MVP ist grob als S1–S7 plus Release-Gate R1 geschnitten.
- S1, S2 und S3 sind gemergt: S1 über Pull Request [#2](https://github.com/anasalkaisi/currivia/pull/2), S2 über [#4](https://github.com/anasalkaisi/currivia/pull/4) und S3 über [#6](https://github.com/anasalkaisi/currivia/pull/6).
- S3 liefert die semesterbasierte Planungszeitachse mit Ist-/Prognose-Trennung, tastaturbedienbarem Verschieben, lokalem Rückgängig und Migration auf Schema v3.
- Formatierung, Linting, Typprüfung, Produktionsbuild und 35 Unit-/Integrationstests sind auf `main` grün; E2E-Tests für den Planungsweg liegen vor.
- Die menschliche Abnahme von S3 und die unabhängige Zweitprüfung der offiziellen Quellen stehen noch aus.

## Verbindliche Lesereihenfolge für die nächste Sitzung

1. diese Datei
2. [MVP-Spezifikation](./mvp-specification.de.md), besonders Abschnitte 4–5 und 10.6–10.9
3. [Delivery-Plan](./delivery-plan.de.md), besonders Planungshorizont, Ready-Gate und Ablauf pro Slice
4. [S3-Recap](../slices/s3-recap.de.md)
5. [S2-Spezifikation](../slices/s2-study-history.de.md) und [S2-Recap](../slices/s2-recap.de.md)
6. [ADR 0001](../decisions/0001-official-and-personal-data.md), [ADR 0002](../decisions/0002-module-component-attempt-model.md) und [ADR 0003](../decisions/0003-declarative-rules-and-versioning.md)
7. [Regel-Designproben](../architecture/rule-design-probes.de.md)

Die übrigen Teile der langen MVP-Spezifikation werden bei Bedarf gelesen; der neue Chat soll sie nicht ungeprüft neu interpretieren.

## Nächste Aktion

1. S3 fachlich und visuell menschlich abnehmen (Planungsweg, Verschieben per Tastatur, Ist-/Prognose-Trennung, Reload-Persistenz).
2. Die unabhängige Zweitprüfung der offiziellen Quellen abschließen.
3. Erst danach S4 (Voraussetzungen anhand eines echten kritischen Wegs) detaillieren.

## Nicht tun

- S4 implementierungsreif bauen, bevor die S3-Abnahme abgeschlossen ist
- die vollständige Regel-Engine vorab bauen
- den vollständigen Modulkatalog ergänzen
- frühere Slices öffentlich als vollständigen Studienplan darstellen
- persönliche Echtdaten in Code, Fixtures, Logs oder Issues übernehmen
- neue Produktentscheidungen ausschließlich im Issue verstecken

## Startsatz für einen neuen Chat

> Lies `docs/product/current-state.de.md` und den dort verlinkten verbindlichen Kontext. Führe anschließend die menschliche Abnahme von S3 auf `main` durch und beginne erst danach mit der Detailplanung von S4.
