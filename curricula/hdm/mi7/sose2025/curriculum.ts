export const curriculumDefinition = {
  regulationVersion: 'mi7-sose2025',
  sourceRevision: 'hdm-sose2025-initial',
  completeness: 'incomplete-development-slice',
  applicability: {
    program: 'medieninformatik-bachelor',
    enrollmentFrom: 'sose-2025',
  },
  gradingScale: {
    allowedHundredths: [100, 130, 170, 200, 230, 270, 300, 330, 370, 400, 500],
  },
  sources: [
    {
      id: 'Q-SPO-2025',
      documentTitle:
        'Studien- und Prüfungsordnung für siebensemestrige Bachelorstudiengänge, Sommersemester 2025',
      publisher: 'Hochschule der Medien Stuttgart',
      officialUrl:
        'https://hdm-stuttgart.de/media/spo/archiv/2025_2_spo_bachelor_7_sose2025_sig.pdf',
      retrievedAt: '2026-08-19',
      fileSha256:
        '9553804700564252f32e3ad9bf4c0fd6350e6dcd3243fe6f7739e003fc58e9bf',
      locations: [
        {
          label: '§ 36, gedruckte Seite 68',
          fact: 'Geltung für Einschreibungen ab Sommersemester 2025',
        },
        {
          label: '§ 36 Tabelle 1, gedruckte Seite 69',
          fact: 'Gesamtumfang 210 ECTS',
        },
        {
          label: '§ 36 Tabelle 2, gedruckte Seite 70',
          fact: '113114 Web Development, Semester 1, 5 ECTS',
        },
      ],
    },
    {
      id: 'Q-MHB-2025',
      documentTitle:
        'Modulhandbuch Medieninformatik Bachelor, Sommersemester 2025',
      publisher: 'Hochschule der Medien Stuttgart',
      officialUrl:
        'https://hdm-stuttgart.de/media/content/hochschule/profil/qualitaetsmanagement/modulhandbuecher/20251_sose2025.zip',
      retrievedAt: '2026-08-19',
      fileSha256:
        '9f06735ec4872754ee801447cf5f0a6e5cf83e220c26bb7e830f019f4ddac87e',
      locations: [
        {
          label: 'PDF-Seite 17',
          fact: 'Pflichtmodul im Grundstudium mit 5 ECTS',
        },
        {
          label: 'PDF-Seite 20',
          fact: 'Keine formalen Modulvoraussetzungen',
        },
      ],
    },
  ],
  curriculumItems: [
    {
      id: 'hdm-mi7-113114',
      officialCode: '113114',
      title: { de: 'Web Development' },
      type: 'module',
      area: 'basic-compulsory',
      recommendedSemester: 1,
      creditsHundredths: 500,
      assessment: {
        id: 'hdm-mi7-113114-written-exam',
        title: { de: 'Schriftliche Prüfung' },
        type: 'written-exam',
        minutes: 60,
      },
      prerequisites: 'none',
      sourceRefs: ['Q-SPO-2025', 'Q-MHB-2025'],
    },
  ],
  requirements: [
    {
      id: 'total-credits',
      operator: 'sumCredits',
      creditStatus: 'BE',
      targetHundredths: 21000,
      sourceRefs: ['Q-SPO-2025'],
    },
  ],
} as const;
