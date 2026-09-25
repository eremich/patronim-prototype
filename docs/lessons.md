# Lessons Learned

<!-- Claude updates this file after every correction from the user. -->
<!-- This is the project's "memory" — patterns to remember and mistakes to avoid. -->
<!-- Claude reads this file at the start of each session. -->

## Format

Each entry follows this pattern:

```
### [Date] Short description
- **What happened**: What went wrong
- **Why**: Root cause
- **Rule**: What to do differently next time
```

## Lessons

### [2026-09-25] Design system must go into Storybook from step 1
- **What happened**: I started base components without Storybook; the user reminded me the DS lives in Storybook as the source of truth, like the patient site (D:\PMS3fivetwo).
- **Why**: The brief only said "movable into Storybook later", and I took that literally.
- **Rule**: For any UI project of this user, set up tokens → Storybook (Introduction, Guidelines, Foundations, Components) in the foundations step, reading tokens from one file. Mirror PMS3fivetwo's structure.

### [2026-09-25] Be economical with tokens
- **What happened**: User asked to save tokens mid-build.
- **Rule**: Batch file writes, verify by page text/JS, screenshot only at checkpoints (contact sheets for many screens).

### [2026-09-25] Dark theme came out purple / AI-slop
- **What happened**: The first dark theme used a navy-tinted night background with a lavender primary (#94A3F5, hue ~231°) and indigo selection. The user said it looked too purple and like AI slop.
- **Why**: I tinted every dark surface toward the brand hue and lightened the navy until it drifted into periwinkle. Indigo-on-navy is the saturated AI dark-mode default.
- **Rule**: Dark surfaces are neutral graphite (chroma ≈ 0). Spend brand color only on actions, selection and links. Keep blue at hue ≤ 222° so it stays blue when it gets lighter. Check the hue, not just the contrast, before showing a palette.
