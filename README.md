# Siguranță / flux

Demo public clean-room, Romanian-first, pentru un inbox operațional de activități de siguranță la locul de muncă. Este o interfață locală/statică cu date sintetice incluse în cod; nu este conectată la un backend.

Demo live (după configurarea GitHub Pages): `https://<organizație>.github.io/<repository>/`

## Stack exact

- Next.js `16.3.0`, React și React DOM `19.2.8`.
- TypeScript `^5.6.3`.
- Vitest `4.1.10`, Vite `8.2.1`, `@vitejs/plugin-react` `6.0.5`.
- Testing Library, jsdom și CSS global fără framework UI.
- Node.js 22 în deploy; Node.js 20.19+ este necesar pentru Next/Vite.

## Arhitectură și flux de date

`app/lib/tasks.ts` conține tipurile, lucrătorii și cele trei activități sintetice, plus clasificarea, validarea și calculul următoarei scadențe. `app/page.tsx` este componenta client: pornește de la `initialTasks`, grupează cu `classifyTask`, iar finalizarea actualizează local starea cu `nextPeriodicTask`. `app/layout.tsx` setează metadata și limba română, iar `app/globals.css` definește prezentarea responsive. Nu există API, persistență, autentificare sau transmitere de date.

## Comportament funcțional

- Inbox-ul grupează activitățile în „Depășite”, „În următoarele 7 zile” și „Mai târziu”, raportat la data fixă de demo 14 februarie 2025.
- Cardurile afișează activitatea, lucrătorul, rolul, locația, categoria și scadența.
- Cardul se expandează într-un formular accesibil; nota trebuie să aibă cel puțin 10 caractere.
- Finalizarea elimină activitatea curentă din grup și creează următoarea scadență folosind recurența activității.
- Bannerul „DEMO SINTETIC” este vizibil permanent.

## Capturi reale

Capturi din exportul static de producție, fără overlay-ul Next.js Dev:

- [Desktop — inbox](docs/screenshots/inbox-desktop.png)
- [Mobil — inbox](docs/screenshots/inbox-mobile.png)

## Matrice P1 criteriu → fișier/test

| Criteriu P1 | Implementare | Dovadă automatizată |
|---|---|---|
| Grupare pe scadență | `app/lib/tasks.ts`, `app/page.tsx` | `test/tasks.test.ts` – clasificare |
| Recurență la finalizare | `app/lib/tasks.ts`, `app/page.tsx` | `test/tasks.test.ts` – scadență următoare; `test/page.test.tsx` – flux UI |
| Validare notă | `app/lib/tasks.ts`, `app/page.tsx` | `test/tasks.test.ts`, `test/page.test.tsx` |
| Interfață în română și date sintetice | `app/layout.tsx`, `app/page.tsx`, `app/globals.css` | `test/page.test.tsx`; build static |
| Export static și Pages | `next.config.mjs`, `.github/workflows/deploy-pages.yml` | `npm run build` produce `out/` |

## Comenzi locale

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

Nu există script `lint`: proiectul nu include un linter configurat, iar CI nu prezintă typecheck-ul drept lint. CI-ul regulat rulează instalare reproducibilă, typecheck, teste, build și audit high.

## Limitări de date și confidențialitate

Toate numele, locațiile, rolurile și activitățile sunt inventate. Datele sunt hardcodate doar pentru demonstrație și nu trebuie înlocuite cu date personale fără o analiză de securitate și confidențialitate. Demo-ul nu pretinde conformitate juridică, evidență oficială SSM sau consultanță legală. Nu conține autentificare, Supabase, cod QR, documente juridice, persoane/companii reale, imagini copiate ori căi private.

## Verificare și publicare

`.github/workflows/ci.yml` păstrează CI-ul pentru push și pull request. `.github/workflows/deploy-pages.yml` construiește exportul static cu `NEXT_PUBLIC_BASE_PATH=/<repository>`, îl urcă drept artifact și îl publică prin GitHub Pages la push pe `main`.
