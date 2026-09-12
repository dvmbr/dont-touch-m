# Project instructions

## Project

- Project name: `dontTouchM`
- Stack: Next.js, React, TypeScript, Tailwind CSS, pnpm.
- Use English for all code comments, filenames, labels, and project-facing text.

## Architecture

- `app/` contains Next.js entrypoints such as routes, layouts, metadata, loading/error pages, and API routes.
- `client/` contains browser UI and interactions.
- Add `server/` only when server-side business logic is actually needed.
- Do not create empty architectural layers prematurely.
- Keep reusable behavior in shared components and challenge-specific behavior in each challenge view.

## Shared M behavior

- `DontTouchM` owns the common M rendering, click reaction, and warning Toast.
- M warnings appear on click, not on mouse enter.
- Every new warning event must restart the Toast fade-out lifecycle.
- Challenge views may use `showWarning()` for challenge-specific events.
- `DontTouchM` owns reusable viewport escape movement and exposes `escape()`; each challenge owns its escape triggers and thresholds.

## Challenge #001

- M remains still until the first successful click.
- After the first click, proximity escape behavior becomes active.
- First click message: `Wait, you actually touched M?!`
- Later successful click message: `You actually caught M!`

## Challenge #002

- Wheel/trackpad input over M blocks scrolling, shows the `Don't scroll M!` warning, and makes M escape to a random viewport position.
- A wheel gesture started over M stays blocked after M escapes until the gesture pauses or the pointer moves; new gestures outside M scroll normally.
- Show the warning and move M only once per blocked wheel gesture. Momentum events only extend the scroll block.
- Scrolling through the challenge scrollbar remains allowed.
- The shared Main provides a bounded, positioned content area while preserving its background and padding. Each challenge owns its scrolling behavior.
- Keep challenge #002 scroll styles in its CSS Module. Do not style shared ancestors or toggle global page classes for scrolling.
- Observe the lower message and return to the top within the challenge #002 scroll container.
- The enlarged scrollbar is intentional.
- Reaching the lower message triggers the surprise behavior and returns the user to the top.
- M escapes on scrolling over M, not on clicks or pointer proximity.

## Development

- Treat the source code as the source of truth for current implementation details.
- Do not duplicate changing implementation details in this file.
- Update this file when an architectural rule, behavioral intention, or deliberate constraint changes.
- Do not refactor working code without a concrete reason.

## Language

- Write all code comments and documentation in English.
- Write all project files, filenames, commit-related documentation, and developer-facing text in English.
- Keep all user-facing UI text in English.
- Do not add Korean text to source code or project documentation.

## Git

- Use short, lowercase commit type prefixes.
- Prefer these project commit types:
  - `feat`: new features or challenge behavior
  - `rftr`: refactoring without changing intended behavior
  - `migr`: migrations or major technology changes
  - `docs`: documentation changes
  - `bkup`: backup-related commits or branches
- Keep commit messages short and written in English.
- Use the format `<type>: <description>`.
- Describe the main purpose of the commit rather than listing every changed file.
- Keep unrelated changes in separate commits when practical.
- Do not create a commit unless explicitly asked to commit.

Examples:

```text
feat: add challenge 002 and enhance shared M interactions
rftr: centralize M escape behavior
docs: add challenge 002
migr: migrate project to Next.js
```

For branches, use the format `<type>/<short-description>` when applicable.

Examples:

```text
feat/002-dont-scroll
rftr/shared-m
migr/nextjs
bkup/spring-mvp
```
