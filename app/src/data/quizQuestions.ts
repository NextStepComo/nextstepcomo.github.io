import { QuizQuestion } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Quando ti trovi davanti a un problema, qual è il tuo primo istinto?',
    options: [
      {
        id: 'q1-a',
        label: 'Lo scompongo in passaggi logici e cerco la soluzione esatta',
        effects: { logica: 18, praticita: 6 },
      },
      {
        id: 'q1-b',
        label: 'Provo subito a costruire qualcosa con le mie mani',
        effects: { praticita: 18, logica: 6 },
      },
      {
        id: 'q1-c',
        label: 'Immagino una soluzione originale, anche fuori dagli schemi',
        effects: { creativita: 18, umanistica: 4 },
      },
      {
        id: 'q1-d',
        label: 'Ne parlo con altri, mi piace risolvere insieme',
        effects: { socialita: 18, umanistica: 4 },
      },
    ],
  },
  {
    id: 'q2',
    text: 'Cosa ti appassiona di più studiare?',
    options: [
      {
        id: 'q2-a',
        label: 'Numeri, formule, dimostrazioni',
        effects: { logica: 16 },
      },
      {
        id: 'q2-b',
        label: 'Storia, letteratura, filosofia',
        effects: { umanistica: 16, creativita: 4 },
      },
      {
        id: 'q2-c',
        label: 'Esperimenti, laboratori, tecnologia',
        effects: { praticita: 12, logica: 8 },
      },
      {
        id: 'q2-d',
        label: 'Arte, musica, scrittura creativa',
        effects: { creativita: 16, umanistica: 6 },
      },
    ],
  },
  {
    id: 'q3',
    text: 'In una giornata ideale, dove ti vedresti?',
    options: [
      {
        id: 'q3-a',
        label: 'In un laboratorio a costruire prototipi',
        effects: { praticita: 16, logica: 6 },
      },
      {
        id: 'q3-b',
        label: 'A organizzare un evento con tante persone',
        effects: { socialita: 18, creativita: 4 },
      },
      {
        id: 'q3-c',
        label: 'In una biblioteca a leggere e scrivere',
        effects: { umanistica: 16 },
      },
      {
        id: 'q3-d',
        label: 'Davanti a un computer a programmare',
        effects: { logica: 14, praticita: 6 },
      },
    ],
  },
  {
    id: 'q4',
    text: 'Quando lavori in gruppo, qual è il tuo ruolo naturale?',
    options: [
      {
        id: 'q4-a',
        label: 'Coordino e motivo il team',
        effects: { socialita: 16, umanistica: 4 },
      },
      {
        id: 'q4-b',
        label: 'Risolvo i problemi tecnici',
        effects: { logica: 12, praticita: 8 },
      },
      {
        id: 'q4-c',
        label: 'Porto idee originali e ispiro gli altri',
        effects: { creativita: 16, socialita: 4 },
      },
      {
        id: 'q4-d',
        label: 'Mi assicuro che tutto sia fatto bene, nei dettagli',
        effects: { praticita: 12, logica: 6 },
      },
    ],
  },
  {
    id: 'q5',
    text: 'Cosa ti piace di più del mondo digitale?',
    options: [
      {
        id: 'q5-a',
        label: 'Capire come funziona, smontarlo',
        effects: { logica: 14, praticita: 6 },
      },
      {
        id: 'q5-b',
        label: 'Creare contenuti originali',
        effects: { creativita: 14, socialita: 4 },
      },
      {
        id: 'q5-c',
        label: 'Connettermi con persone',
        effects: { socialita: 14, umanistica: 4 },
      },
      {
        id: 'q5-d',
        label: 'Lo uso poco, preferisco le esperienze reali',
        effects: { praticita: 10, umanistica: 8 },
      },
    ],
  },
  {
    id: 'q6',
    text: 'Tra 10 anni cosa ti renderebbe orgoglioso?',
    options: [
      {
        id: 'q6-a',
        label: 'Aver inventato qualcosa di tecnologico',
        effects: { logica: 12, creativita: 8, praticita: 4 },
      },
      {
        id: 'q6-b',
        label: 'Aver aiutato persone, famiglie, comunità',
        effects: { socialita: 14, umanistica: 8 },
      },
      {
        id: 'q6-c',
        label: 'Aver costruito qualcosa con le mie mani',
        effects: { praticita: 16, creativita: 4 },
      },
      {
        id: 'q6-d',
        label: 'Aver creato un\'opera (libro, film, brand)',
        effects: { creativita: 14, umanistica: 8 },
      },
    ],
  },
];
