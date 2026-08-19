import type { OfficialStatus } from '@currivia/schema';

export const content = {
  brand: 'Currivia',
  productName: 'Studienverlaufsplaner',
  pilotLine: 'Pilotkonfiguration für Medieninformatik an der HdM',
  developmentWarning:
    'Entwicklungs-Slice S2: Der Curriculumsdatensatz enthält weiterhin nur ein Modul und darf nicht für Studienentscheidungen verwendet werden.',
  disclaimer:
    'Currivia trifft keine verbindlichen Prüfungsentscheidungen und ersetzt keine Studienberatung.',
  unsupported:
    'Dieser Einschreibezeitraum gehört nicht zum bestätigten Geltungsbereich von mi7-sose2025. Ein persönlicher Planner wird nicht geöffnet.',
  invalidStorageTitle: 'Lokaler Zustand konnte nicht sicher geladen werden',
  invalidStorageBody:
    'Die gespeicherten Daten passen nicht zum aktuellen S2-Schema. Sie wurden weder übernommen noch überschrieben.',
} as const;

export const areaLabels = {
  'basic-compulsory': 'Pflicht · Grundstudium',
} as const;

export const statusOptions: {
  code: OfficialStatus;
  label: string;
  help: string;
}[] = [
  { code: 'AN', label: 'Angemeldet', help: 'Begonnen oder angemeldet' },
  { code: 'BE', label: 'Bestanden', help: 'ECTS werden angerechnet' },
  { code: 'NB', label: 'Nicht bestanden', help: 'Keine ECTS' },
  { code: 'EN', label: 'Endgültig nicht bestanden', help: 'Offiziell klären' },
  {
    code: 'RT',
    label: 'Rücktritt',
    help: 'Keine automatische Versuchswertung',
  },
];
