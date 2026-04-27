# Next Step

App di orientamento scolastico/universitario italiano.
Implementazione React Native / Expo del piano descritto in `Document 1.pdf`.

## Quick start

```bash
npm install
npx expo start --web      # apre in browser
npx expo start            # mobile (Expo Go o emulatore)
```

## Stack

- **Expo SDK 51** + React Native 0.74 + TypeScript
- **expo-router** (file-based navigation)
- **Zustand** (state management) — sostituisce Riverpod del piano originale
- **react-native-maps** + tile OpenStreetMap (gratuito, no API key)
- **AsyncStorage** per la persistenza locale
- **Mock backend + mock AI** in `src/services/` — pronti per essere sostituiti con Supabase + Gemini reali

## Struttura

```
app/                  Expo Router (schermate)
  (auth)/login.tsx       Login
  (auth)/path.tsx        Selezione percorso (medie / superiori)
  (onboarding)/quiz.tsx  Quiz AI di orientamento
  (tabs)/dashboard.tsx   Dashboard risultati + indirizzo consigliato
  (tabs)/mappa.tsx       Mappa scuole vicine
  (tabs)/profilo.tsx     Profilo utente con valori
  school/[id].tsx        Dettaglio scuola
  tutor.tsx              AI Tutor per materia

src/
  data/schools.json      10 scuole italiane (mock)
  data/quizQuestions.ts  6 domande del quiz
  lib/matching.ts        Algoritmo di scoring (PDF: 0.6*affinità + 0.4*distanza)
  services/              mockBackend.ts, mockGemini.ts, location.ts
  store/                 authStore, quizStore, schoolsStore (Zustand)
  components/            UI primitives e widget riutilizzabili
  theme.ts               Colori, font, spacing del brand
  types.ts               Modelli TypeScript
```

## Sostituire i mock con i servizi reali

### Gemini AI

Crea `.env` nella root:

```
EXPO_PUBLIC_GEMINI_KEY=la-tua-key
```

Quando la variabile è presente, `src/services/mockGemini.ts` chiama il modello reale invece dei mock.

### Supabase

In `src/services/mockBackend.ts` ci sono i punti `// TODO swap` dove sostituire le chiamate fittizie con il client Supabase.
Lo schema del DB è in `Document 1.pdf` (sezione "Schema Database Supabase").

## Algoritmo di matching (dal PDF)

```
Match Score = (affinità_valori * 0.6) + (distanza_score * 0.4)

Distanza:  <5km  → 100%
           5-10km →  70%
          10-20km →  40%
           >20km →  10%
```

Vedi `src/lib/matching.ts` per l'implementazione completa.

## Note

L'app è in italiano, hard-coded come da PDF. Tutti i dati sono fittizi e a scopo dimostrativo.
