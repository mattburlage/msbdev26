// How I build — one list drives section 03 and the IDE's principles/ folder,
// where each principle is its own markdown file (slug = filename).

export interface Principle {
  slug: string;
  title: string;
  text: string;
}

export const PRINCIPLES_TAGLINE = 'The hard part is the fun part.';

export const principles: Principle[] = [
  {
    slug: 'self-sufficient',
    title: 'Self-sufficient',
    text: "I'm at my best taking on a task, understanding the why behind it along with the constraints and expectations, then executing.",
  },
  {
    slug: 'sure-calls',
    title: 'Fast on the sure calls, consensus on the big ones',
    text: 'On familiar ground I decide quickly and move. When a call is high-stakes or genuinely ambiguous, I slow down on purpose and bring in the people it affects the most.',
  },
  {
    slug: 'collaboration',
    title: 'Collaboration where it counts',
    text: "I reach for collaboration where it moves the work: code review, training, and untangling a genuinely hard problem together. Otherwise I'm heads-down and shipping.",
  },
  {
    slug: 'clear-committed',
    title: 'Clear, then committed',
    text: 'I raise concerns and tradeoffs early, so calls get made with the full picture. Once we land on a direction, I follow through.',
  },
];
