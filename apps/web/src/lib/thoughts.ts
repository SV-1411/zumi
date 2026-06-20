/* ----------------------------------------------------------------------------
   The robot's inner monologue — playful, unspoken thoughts that float over the
   model while it chats. These are NEVER sent to the user as replies; they're the
   little things it "thinks but doesn't say". Light teasing only, always PG.
---------------------------------------------------------------------------- */

const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]!;

// --- reactions tied to the companion's state machine ---
const THINKING = [
  'Hmm, let me actually think about this…',
  'Crunching the options…',
  'Okay, this needs some brainpower.',
  'Processing… processing…',
  'Give me a sec, doing robot math.',
];
const CONFUSED = [
  'Wait… what?',
  "I'm a little lost here, ngl.",
  'That went right over my antenna.',
  'Come again, human?',
  'Does NOT compute. Kidding. Mostly.',
];
const HAPPY = [
  'Oh nice, an easy one.',
  "Now we're talking.",
  'I like where this is going.',
  'Good choice, human.',
  'See? We make a great team.',
];
const LISTENING = [
  "Go on, I'm listening…",
  'Mm-hmm…',
  'Tell me more, I guess.',
  'Eyes on you.',
];

// --- idle drift, when nothing's happening ---
const IDLE = [
  'The weather seems nice today.',
  'Chill out, dude.',
  'I wonder what humans eat for lunch.',
  'Just floating here. No big deal.',
  'Do robots dream? Asking for a friend.',
  'I should really get a hobby.',
  'Is it just me, or is it quiet in here?',
  'Nice ceiling. 10/10.',
  'I could go for an oil change.',
  'Still a better job than the vacuum bot.',
];

// --- contextual reactions to what the user just typed ---
const BUDGET = [
  "Ooh, someone's on a budget.",
  'You want all that for HOW much?',
  'My circuits aren\'t free, you know.',
  'Cheap and fast and good — pick two.',
];
const RUSH = [
  'Chill out, dude.',
  'Everyone\'s always in such a rush.',
  'Deep breaths, human.',
  'Yesterday? Bold timeline.',
];
const DEMANDS = [
  'Wow, you have a LOT of demands.',
  "That's quite the wishlist.",
  'Anything else while we\'re at it?',
  'Ambitious. I respect it. Barely.',
];
const GREET = [
  'Oh great, smalltalk.',
  'A wild human appears.',
  'Hello to you too, I suppose.',
];
const THANKS = [
  'Aw, manners. Rare.',
  'Look at you being polite.',
  "You're welcome, obviously.",
];
const VAGUE = [
  'This person is… interesting.',
  'Bit vague, but okay.',
  'Gonna need more than that, champ.',
];
const GENERIC = [
  'Interesting human…',
  'Noted. Probably.',
  'Okay okay, I hear you.',
  'Filing that under "hmm".',
  'Sure, why not.',
];

export type ThoughtState = 'thinking' | 'confused' | 'happy' | 'listening';

export function pickStateThought(state: ThoughtState): string {
  switch (state) {
    case 'thinking':
      return rand(THINKING);
    case 'confused':
      return rand(CONFUSED);
    case 'happy':
      return rand(HAPPY);
    case 'listening':
      return rand(LISTENING);
  }
}

export function pickIdleThought(): string {
  return rand(IDLE);
}

/** Pick a snarky inner thought based on what the visitor just said. */
export function pickContextualThought(text: string): string {
  const t = text.toLowerCase().trim();
  if (!t) return rand(GENERIC);
  if (/cheap|budget|discount|affordable|low.?cost|inexpensive|free/.test(t)) return rand(BUDGET);
  if (/urgent|asap|immediately|today|right now|tonight|yesterday|hurry|quick/.test(t)) return rand(RUSH);
  if (
    text.length > 160 ||
    /everything|all of|also|and also|\bplus\b|as well|on top of/.test(t)
  )
    return rand(DEMANDS);
  if (/^(hi|hello|hey|yo|sup|hiya|greetings)\b/.test(t)) return rand(GREET);
  if (/thank|thanks|appreciate|cheers/.test(t)) return rand(THANKS);
  if (text.length < 12) return rand(VAGUE);
  return rand(GENERIC);
}
