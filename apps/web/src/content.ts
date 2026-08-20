import type { OfficialStatus } from '@currivia/schema';

export const content = {
  brand: 'Currivia',
  productName: 'Studienverlaufsplaner',
  pilotLine: 'Pilotkonfiguration für Medieninformatik an der HdM',
  developmentWarning:
    'Entwicklungs-Slice S3: Der Curriculumsdatensatz enthält weiterhin nur ein Modul und darf nicht für Studienentscheidungen verwendet werden.',
  disclaimer:
    'Currivia trifft keine verbindlichen Prüfungsentscheidungen und ersetzt keine Studienberatung.',
  unsupported:
    'Dieser Einschreibezeitraum gehört nicht zum bestätigten Geltungsbereich von mi7-sose2025. Ein persönlicher Planner wird nicht geöffnet.',
  invalidStorageTitle: 'Lokaler Zustand konnte nicht sicher geladen werden',
  invalidStorageBody:
    'Die gespeicherten Daten passen nicht zum aktuellen S3-Schema. Sie wurden weder übernommen noch überschrieben.',
} as const;

export const areaLabels = {
  'basic-compulsory': 'Pflicht · Grundstudium',
} as const;

const statusDetails: Record<OfficialStatus, { label: string; help: string }> = {
  AN: { label: 'Angemeldet', help: 'Begonnen oder angemeldet' },
  BE: { label: 'Bestanden', help: 'ECTS werden angerechnet' },
  NB: { label: 'Nicht bestanden', help: 'Keine ECTS' },
  EN: { label: 'Endgültig nicht bestanden', help: 'Offiziell klären' },
  RT: {
    label: 'Rücktritt',
    help: 'Keine automatische Versuchswertung',
  },
};

const statusOrder: OfficialStatus[] = ['AN', 'BE', 'NB', 'EN', 'RT'];

export const statusOptions = statusOrder.map((code) => ({
  code,
  ...statusDetails[code],
}));
