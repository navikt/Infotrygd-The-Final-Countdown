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
├── server.mjs          Node.js-server for statiske filer i produksjon
├── server.test.mjs     Tester for produksjonsserveren
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

## Test

Det finnes en liten test som verifiserer at hovedkomponenten rendrer teksten og nedtellingen som forventet.

```bash
cd frontend
pnpm test
```

Dette kjører Vitest for frontend-koden og Node.js-tester for produksjonsserveren.

## Bygg for produksjon

```bash
cd frontend
pnpm build
```

Den produserte byggfilen ligger i `frontend/dist`.

Containeren bruker Chainguard Node.js 24 fra Navs registry og serverer filene
med `server.mjs` på port 8080. Serveren bruker bare innebygde Node.js-moduler.
Den beholder SPA-ruting, sikkerhetsheadere og helseendepunktene
`/internal/isAlive` og `/internal/isReady`. Filer under `/assets/` caches i ett
år, mens HTML ikke caches.

Start produksjonsserveren lokalt etter bygg:

```bash
cd frontend
node server.mjs
```

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
