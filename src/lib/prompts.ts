export const PROMPT_OPTIONS = [
  "A life goal of mine",
  "My simple pleasures",
  "I'm looking for",
  "My ideal first date",
  "The way to my heart is",
  "I geek out on",
  "My most spontaneous moment",
  "Two truths and a lie",
  "I'll pick the restaurant if you",
  "Something that surprises people about me",
  "My love language is",
  "A perfect Sunday looks like",
] as const;

export type PromptOption = (typeof PROMPT_OPTIONS)[number];
