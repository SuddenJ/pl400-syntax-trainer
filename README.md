# PL-400 Syntax Trainer

Mobile-first active-recall practice for PL-400 developer syntax (Power Fx, Dataverse plug-ins/SDK, Xrm Client API, PCF).

This is **not** primarily an exam simulator. It trains exact interfaces, classes, methods, properties, and formula shapes until they are automatic.

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL (Vite). The question bank JSON is generated automatically before `dev` and `build`.

## Question bank

Authoritative source:

[`PL400_PowerFx_Dataverse_Syntax_Practice_Bank.md`](./PL400_PowerFx_Dataverse_Syntax_Practice_Bank.md)

Build structured JSON:

```bash
npm run question-bank:build
```

Output: `src/data/questions.generated.json`

The parser fails the build if IDs are duplicated, a question lacks an answer, or the answer key references an unknown ID.

## Testing

```bash
npm run typecheck
npm run test
npm run test:e2e
```

## Production build

```bash
npm run build
npm run preview
```

`build` always regenerates the question bank first.

## Progress storage

All study history lives in **browser `localStorage`** (no accounts, analytics, or backend).

Use **Settings → Export / Import progress JSON** to move progress between devices. Reset requires confirmation.

## Deployment (GitHub Pages)

Workflow: [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)

- Builds with `VITE_BASE_PATH=/<repo>/`
- Runs unit tests
- Deploys `dist` with the official GitHub Pages actions

After the first successful run, the app is available at:

`https://<username>.github.io/pl400-syntax-trainer/`

Hash routing (`HashRouter`) avoids GitHub Pages refresh issues.

## PWA

The app is installable. After one online load, the static question bank and shell are cached for offline practice.
