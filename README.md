# Siguranță în flux

Demo de portofoliu pentru un flux de securitate și sănătate în muncă (SSM), în limba română.

**Demo live:** https://luciandanileico94-dev.github.io/workplace-safety-demo/

## Domeniu exact

Aplicația este un prototip local al unui serviciu SSM cu șase niveluri de acces: director, administrator, angajat al serviciului, companie client, conducător al locului de muncă și lucrător. Structura urmează cabinetele sursă: clienți și modurile A/B, puncte de lucru, lucrători, sarcini prioritizate, jurnal cu autorul acțiunii și cardul read-only al lucrătorului cu acces prin cod.

Scenariul interactiv principal este complet: compania atribuie instruirea, lucrătorul parcurge trei secțiuni cu retry și, la final, registrul companiei reflectă admiterea demonstrativă. În cabinetul serviciului, bannerul „Lucrez pentru client” arată modul B și faptul că acțiunile intră în jurnal.

Starea este păstrată în `localStorage`; butonul „Resetează demo” șterge progresul. Datele, numele, companiile și locațiile sunt inventate.

## Dezvăluire de siguranță

Acesta este un demo sintetic de portofoliu, nu un serviciu reglementat și nu o evidență oficială SSM. Nu generează semnături, certificate sau documente juridice și nu înlocuiește instruirea practică, procedurile interne ori verificarea legală.

## Stack și comenzi

Stack-ul acestui repo este Next.js 16, React 19, TypeScript, Vitest, Testing Library și CSS simplu. Nu există date de produs externe sau apeluri de rețea.

```bash
npm ci
npm test
npm run build
npm run dev
```

Deschide `http://localhost:3000`. Pentru scenariul principal: „Companie” → „Atribuie instruirea” → „Lucrător” → răspunde la cele trei întrebări → „Vezi registrul companiei”. Toate datele sunt locale; nu există login, API sau acces la date private.
