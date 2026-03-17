# Implementation Plan: Profile Cards, Opt-in UX, Mobile-First Redesign

## Phase 1: Schema & Data Model Updates
- Add `ProfilePhoto` model (up to 4 photos per user, with ordering)
- Add `ProfilePrompt` model (2-3 prompts per user with answers)
- Add predefined prompt options list
- Run migration

## Phase 2: API Updates
- Update user API to handle photo uploads (URL-based for now) and prompt answers
- Add GET endpoint for viewing another user's profile (photos + prompts)
- Update opt-ins API to include invitee profile summary

## Phase 3: Profile Card Component
- Swipeable/scrollable photo carousel (mobile touch-friendly)
- Prompt + answer display cards
- Bio section
- Compact "mini card" variant (photo, name, snippet) for lists
- Expandable full profile view

## Phase 4: Enhanced Opt-in Flow
- Invitees: Browse assigned experiences with inviter profile preview
- Invitees: Opt-in with message + their profile auto-attached
- Inviters: See mini cards of invitees who opted in
- Inviters: Tap to expand full invitee profile, then accept/pass

## Phase 5: Mobile-First UI Redesign (Clean & Minimal)
- Design tokens: whitespace-heavy, subtle accents, elegant typography
- Mobile-first layouts (iPhone 390-393px width baseline)
- Bottom navigation bar (mobile pattern)
- Card-based layouts with generous padding
- Smooth transitions and micro-interactions
- Update all existing pages to new design system
