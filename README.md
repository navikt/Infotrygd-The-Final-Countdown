# Infotrygd-The-Final-Countdown

En liten React-applikasjon som viser en nedtelling til når Infotrygd skal være ute av drift. Appen bruker [Nav Aksel](https://aksel.nav.no/) for styling og komponenter, og har en enkel live timer som oppdateres hvert sekund.

## Hva appen gjør

- viser en stor nedtelling til 31. desember 2028 kl. 23:59:59
- beskriver at tiden som gjenstår til at fagrutiner i Infotrygd skal være utfaset
- oppdaterer timeren i sanntid med sekundersintervall
- viser en ferdig-status når nedtellingen er nådd
- bruker Vite og React for en enkel frontend uten backend

## Teknologier

- React 19
- Vite
- JavaScript (ikke TypeScript i denne versjonen)
- @navikt/ds-react
- @navikt/ds-css
- CSS for egen visuell styling

## Struktur

```text
frontend/
├── src/
│   ├── App.jsx         Hovedkomponent med nedtelling og tekst
│   ├── main.jsx        React entrypoint
│   └── styles.css      Layout, styling og animasjoner
├── index.html          HTML entry
├── vite.config.ts      Vite-konfigurasjon
├── package.json        NPM/pnpm scripts og avhengigheter
├── tsconfig.json       TypeScript-konfigurasjon
├── .env.example        Eksempel på miljøvariabler
├── Dockerfile          Container for appen
├── nginx.conf          Nginx-konfig for produksjon
├── public/             Statisk innhold
└── node_modules/       Installerte pakker (lokalt)
```

## Kjør lokalt

```bash
cd frontend
pnpm install
pnpm dev
```

Appen startes normalt på:

```text
http://localhost:3000
```

## Bygg for produksjon

```bash
cd frontend
pnpm build
```

Den produserte byggfilen ligger i `frontend/dist`.

## Forhåndsvis bygg

```bash
cd frontend
pnpm preview
```

## Slik fungerer timeren

`App.jsx` definerer en mål tid i 2028:

```js
const TARGET_TIME = new Date("2028-12-31T23:59:59+01:00").getTime();
```

Deretter beregnes antall dager, timer, minutter og sekunder som er igjen, og disse oppdateres med `setInterval` hver sekund.

## Nye endringer

Dette repoet er nå navngitt for prosjektet `Infotrygd-The-Final-Countdown` og er tilpasset den faktiske koden i `frontend/src`, ikke en gammel kopi fra en annen app.

