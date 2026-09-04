# Copilot Instructions – Infotrygd-The-Final-Countdown

Dette prosjektet er en enkel React-app som viser en live nedtelling til når Infotrygd skal være ute av drift. Appen bruker Vite og Nav Aksel, og innholdet i `frontend/src` er det som gjelder for implementasjon og oppdateringer.

## Arkitektur

```text
root
├── frontend/              Vite + React app
├── .github/               CI/CD- og repo-konfigurasjon
├── .nais/                 NAIS-manifester for deploy
├── Makefile               Snarveier for lokale kommandoer
├── README.md              Prosjektbeskrivelse
└── .github/copilot-instructions.md
```

## Prosjektformål

Appen viser:
1. en stor nedtelling til 31. desember 2028 kl. 23:59:59
2. tekst om når Infotrygd skal være utfaset
3. en oppdatering i sanntid hvert sekund
4. en ferdig-status når nedtellingen er nådd

## Teknologistack

### Frontend
- React 19
- Vite
- JavaScript
- `@navikt/ds-react` og `@navikt/ds-css`
- CSS for egen styling

### Deploy
- NAIS deploy via `.nais/`
- GitHub Actions for bygg og deploy
- Docker for frontend-image

## Kommandoer

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm test
```

### Repo-root
```bash
make install
make start
make build
make test
```

## Kodeoppsett i frontend

```text
frontend/src/
├── App.jsx         Hovedkomponent med nedtelling og tekst
├── main.jsx        React entrypoint
├── styles.css      Layout, styling og animasjoner
└── ...             øvrige filer i appen
```

## Frontend-konvensjoner

- Bruk funksjonelle React-komponenter og standard hooks.
- Lag oversiktlig og liten UI-logikk i `App.jsx` eller relevante hjelpefunksjoner.
- Bruk Nav Aksel-komponenter der det passer for konsistent design.
- Hold styling i `src/styles.css` eller komponentnær CSS.
- Unngå å kopiere gamle app-eksempler eller gamle prosjektbeskrivelser.

## Lokal utvikling

```bash
cd frontend
pnpm install
pnpm dev
```

Appen åpnes på `http://localhost:3000`.

## Endringsregler for Copilot

- Basér alle forslag på faktisk repo-innholdet i `frontend/src`.
- Ikke importér eller anbefal kode fra gamle prosjekter.
- Ikke introduser eldre prosjekt-nomenklatur eller beskrivelser som ikke finnes i den faktiske koden.
- Når du endrer kjørbar kode, kjør relevant build/test etterpå.
- Vær ekstra nøye med deploy-filer og prosjektmetadata.
