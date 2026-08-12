# Siguranță / flux

Demo public, clean-room, pentru un inbox operațional de activități de siguranță la locul de muncă. Interfața este în limba română și folosește exclusiv date inventate: angajați, locații și activități sintetice.

## Pornire locală

Necesită Node.js 20+.

```bash
npm ci
npm run dev
```

Verificări:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Ce demonstrează

- inbox responsive cu activități depășite, scad în următoarele 7 zile și mai târziu;
- carduri cu muncitori sintetici, locație, categorie și recurență;
- formular expandabil, accesibil, cu validare, mesaj de eroare și confirmare;
- finalizarea elimină activitatea curentă și programează automat următoarea scadență periodică;
- teste pentru clasificare, validare și interacțiunea principală;
- CI GitHub Actions pentru instalare reproducibilă, typecheck, lint, teste și build.

Acesta este un demo de portofoliu, nu un sistem juridic, nu o evidență oficială SSM și nu oferă consultanță legală. Nu conține autentificare, Supabase, cod QR, documente juridice, persoane sau companii reale, imagini copiate ori căi private.
