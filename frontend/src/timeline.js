export const phaseDefinitions = {
  rosa: "All saksbehandling i Infotrygd",
  lilla: "Nyutviklingsfase for nytt system",
  oransje: "Nytt system blir tatt i bruk (parallelt blir Infotrygd brukt)",
  grønn: "Skrudd av rutine i Infotrygd",
};

export const items = [
  "Pensjon",
  "Attføring",
  "Gjenlevende",
  "Barnetrygd",
  "Barns sykdom",
  "Foreldrepenger",
  "Enslig forsørger",
  "Gravferdsstønad og båretransport",
  "Grunn- og hjelpestønad",
  "Hjelpemidler",
  "Kontantstøtte",
  "Yrkesskade",
  "Rehabiliteringspenger",
  "Supplerende stønad over 67 år",
  "Forsikringer",
  "Sykepenger",
  "Tidsbegrenset uføretrygd",
  "Helsetjenester",
  "Medlemskap",
  "Regnskap",
];

export const greenStarts = {
  "Tidsbegrenset uføretrygd": "07.10.2022",
  Rehabiliteringspenger: "27.03.2023",
  Attføring: "27.03.2023",
  Pensjon: "29.09.2023",
  Regnskap: "12.03.2023",
  "Enslig forsørger": "29.10.2024",
  Kontantstøtte: "10.09.2026",
  Foreldrepenger: "14.10.2026",
  "Barns sykdom": "01.07.2026",
};

const markings = {
  Pensjon: [
    { start: 20111, end: 20221, color: "lilla" },
    { start: 20222, end: 20231, color: "oransje" },
  ],
  Attføring: [
    { start: 20111, end: 20221, color: "lilla" },
    { start: 20222, end: 20222, color: "oransje" },
  ],
  Rehabiliteringspenger: [
    { start: 20111, end: 20221, color: "lilla" },
    { start: 20222, end: 20222, color: "oransje" },
  ],
  Regnskap: [
    { start: 20111, end: 20221, color: "lilla" },
    { start: 20222, end: 20222, color: "oransje" },
  ],
  "Tidsbegrenset uføretrygd": [
    { start: 20111, end: 20212, color: "lilla" },
    { start: 20221, end: 20221, color: "oransje" },
  ],
  Gjenlevende: [{ start: 20111, end: 20261, color: "oransje" }],
  Barnetrygd: [
    { start: 20111, end: 20171, color: "rosa" },
    { start: 20172, end: 20182, color: "lilla" },
    { start: 20191, end: 20262, color: "oransje" },
  ],
  "Barns sykdom": [
    { start: 20111, end: 20181, color: "rosa" },
    { start: 20182, end: 20192, color: "lilla" },
    { start: 20201, end: 20261, color: "oransje" },
  ],
  "Enslig forsørger": [
    { start: 20111, end: 20172, color: "rosa" },
    { start: 20181, end: 20191, color: "lilla" },
    { start: 20192, end: 20241, color: "oransje" },
  ],
  Foreldrepenger: [
    { start: 20111, end: 20152, color: "rosa" },
    { start: 20161, end: 20181, color: "lilla" },
    { start: 20182, end: 20261, color: "oransje" },
  ],
  "Gravferdsstønad og båretransport": [
    { start: 20111, end: 20261, color: "rosa", endDate: new Date(2026, 2, 31) },
    {
      start: 20261, end: 20262, color: "lilla",
      startDate: new Date(2026, 3, 1), endDate: new Date(2026, 9, 29),
    },
  ],
  "Grunn- og hjelpestønad": [
    { start: 20111, end: 20261, color: "rosa", endDate: new Date(2026, 2, 31) },
    {
      start: 20261, end: 20262, color: "lilla",
      startDate: new Date(2026, 3, 1), endDate: new Date(2026, 9, 29),
    },
  ],
  Kontantstøtte: [
    { start: 20111, end: 20172, color: "rosa" },
    { start: 20181, end: 20221, color: "lilla" },
    { start: 20222, end: 20261, color: "oransje" },
  ],
  Sykepenger: [
    { start: 20111, end: 20191, color: "rosa" },
    { start: 20192, end: 20262, color: "lilla" },
  ],
  Yrkesskade: [
    { start: 20111, end: 20212, color: "rosa" },
    { start: 20221, end: 20262, color: "lilla", endDate: new Date(2026, 9, 29) },
  ],
  Forsikringer: [
    { start: 20111, end: 20261, color: "rosa" },
    { start: 20262, end: 20262, color: "lilla", endDate: new Date(2026, 9, 29) },
  ],
  "Supplerende stønad over 67 år": [
    { start: 20111, end: 20251, color: "rosa" },
    { start: 20252, end: 20252, color: "lilla" },
    { start: 20261, end: 20262, color: "oransje", endDate: new Date(2026, 9, 29) },
  ],
  Helsetjenester: [
    { start: 20111, end: 20241, color: "rosa", endDate: new Date(2024, 2, 31) },
    { start: 20241, end: 20262, color: "lilla", startDate: new Date(2024, 3, 1) },
  ],
  Hjelpemidler: [
    { start: 20111, end: 20192, color: "rosa" },
    { start: 20201, end: 20262, color: "lilla" },
  ],
  Medlemskap: [
    { start: 20111, end: 20192, color: "rosa" },
    { start: 20201, end: 20262, color: "lilla" },
  ],
};

export function getPeriods(item) {
  const periods = [...(markings[item] ?? [])];
  const date = greenStarts[item];

  if (date) {
    const [, month, year] = date.split(".").map(Number);
    periods.push({
      start: year * 10 + (month <= 6 ? 1 : 2),
      end: 20282,
      color: "grønn",
      date,
    });
  }

  return periods.map((period) => ({
    ...period,
    startDate: period.startDate
      ?? new Date(Math.floor(period.start / 10), period.start % 10 === 1 ? 0 : 6, 1),
    endDate: period.endDate
      ?? new Date(Math.floor(period.end / 10), period.end % 10 === 1 ? 6 : 12, 0),
  }));
}
