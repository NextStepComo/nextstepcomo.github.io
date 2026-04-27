import { QuizResult, UserValues, ChatMessage } from '@/types';
import { rankSchools, suggestIndirizzo } from '@/lib/matching';
import schools from '@/data/schools.json';
import { School } from '@/types';

const allSchools = schools as School[];

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

/**
 * Mock dell'AI Mentor che genera l'esito del quiz.
 * Quando `EXPO_PUBLIC_GEMINI_KEY` è settata, qui andrebbe inserita la chiamata reale a Gemini.
 */
export async function aiGenerateQuizResult(
  user: UserValues,
  level: 'superiori' | 'universita'
): Promise<QuizResult> {
  await wait(800);
  const ranked = rankSchools(user, allSchools, null, { level });
  const { indirizzo, perche, materie } = suggestIndirizzo(user, ranked);

  const traits = traitsFromValues(user);

  // TODO swap: se EXPO_PUBLIC_GEMINI_KEY è presente, sostituire con chiamata reale.

  return { values: user, indirizzo, perche, materie, traits };
}

function traitsFromValues(v: UserValues): string[] {
  const map: { key: keyof UserValues; trait: string }[] = [
    { key: 'logica', trait: 'Pensiero analitico' },
    { key: 'creativita', trait: 'Creatività' },
    { key: 'socialita', trait: 'Empatia sociale' },
    { key: 'praticita', trait: 'Concretezza' },
    { key: 'umanistica', trait: 'Sensibilità umanistica' },
  ];
  return map
    .map((m) => ({ ...m, value: v[m.key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((m) => m.trait);
}

const SUBJECT_INTRO: Record<string, string> = {
  Informatica: "Sono il tuo tutor di Informatica! Posso spiegarti algoritmi, linguaggi, basi di dati o aiutarti col codice.",
  Matematica: "Ciao! Sono qui per aiutarti con la matematica: dalle equazioni all'analisi, passando per la geometria.",
  Fisica: "Salve! Possiamo parlare di meccanica, termodinamica, elettromagnetismo o problemi pratici di fisica.",
  Scienze: "Benvenuto! Posso aiutarti con biologia, chimica, scienze della Terra e tanti esperimenti.",
  Inglese: "Hi! I'm your English tutor — possiamo lavorare su grammatica, listening, writing o conversazione.",
};

const FACT_BANK = [
  "Lo sapevi? Il primo programma di computer fu scritto da Ada Lovelace nel 1843.",
  "Lo sapevi? La radice quadrata di 2 era talmente sconvolgente per i pitagorici da essere tenuta segreta.",
  "Lo sapevi? La velocità della luce nel vuoto è esattamente 299 792 458 m/s — è una definizione, non una misura.",
  "Lo sapevi? L'occhio umano distingue circa 10 milioni di colori diversi.",
  "Lo sapevi? La parola 'spam' nel senso informatico viene da uno sketch dei Monty Python del 1970.",
];

/**
 * Mock di una risposta del Tutor AI per una materia specifica.
 * Quando EXPO_PUBLIC_GEMINI_KEY è presente, qui andrebbe sostituita con la chiamata reale.
 */
export async function aiTutorReply(
  subject: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  await wait(700 + Math.random() * 600);
  const intro = SUBJECT_INTRO[subject] ?? `Sono il tuo tutor di ${subject}.`;
  const fact = FACT_BANK[Math.floor(Math.random() * FACT_BANK.length)];

  if (history.length === 0) {
    return `${intro}\n\nDimmi pure: hai una domanda, un esercizio da risolvere insieme, o vuoi un riepilogo di un argomento?`;
  }

  const trimmed = userMessage.trim();
  const summary =
    trimmed.length < 8
      ? `Ottimo, partiamo. In ${subject} il punto chiave è collegare la teoria a esempi concreti.`
      : `Domanda interessante su "${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}".\n\nProviamo a scomporla così: identifichiamo il concetto, vediamo un esempio, e poi un esercizio breve.`;

  return `${summary}\n\n${fact}\n\n— Vuoi che approfondisca con un esempio numerico o con un esercizio guidato?`;
}
