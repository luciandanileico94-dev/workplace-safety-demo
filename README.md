# Siguranță în flux

Demo de portofoliu pentru un flux de securitate și sănătate în muncă (SSM), în limba română.

**Demo live:** https://luciandanileico94-dev.github.io/workplace-safety-demo/

## Domeniu exact

Aplicația ilustrează un scenariu sintetic, fără autentificare și fără backend: serviciul SSM vede două companii de construcții, compania vede lucrători, puncte de lucru și termene, iar compania poate atribui instruirea unui lucrător. În rolul Lucrător, utilizatorul parcurge exact trei secțiuni scurte, confirmând fiecare printr-un răspuns. Un răspuns greșit oferă explicație și permite retry. La final, registrul companiei arată instruirea completă, istoricul de încercări, următorul termen și starea demonstrativă de admisibilitate.

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

Deschide `http://localhost:3000`. Pentru scenariul principal: „Companie” → „Atribuie instruirea” → „Lucrător” → răspunde la cele trei întrebări → „Vezi registrul companiei”.
