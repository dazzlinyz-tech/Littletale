# PRD: LittleTale - Where is Bunny? (Updated v2.2)

**One-line summary:** LittleTale is an interactive English picture-book reading app that guides 1st–2nd grade learners through a 4-stage chase story ("Bunny's Chase"), progressing page by page through Listening → Finding → Complete Sentence Speaking (`[Listen & Say]` with full-sentence completion validation), featuring multi-layered sound mystery puzzles and a charming tactile picture-book experience.

---

## 1. App Overview

**LittleTale** is a mobile-first web app that transforms the original English picture book **"Where is Bunny?"** into an interactive 4-stage chase adventure. Instead of finding Bunny in a single static spot, Bunny keeps running away to new places throughout the story:

> **The 4 Progressive Chase Stages:**
> 1. 🌲 **Stage 1: Forest Entrance (숲 입구)** — Sunny meadow arch, wildflowers, and winding wooden trail where Bunny starts running.
> 2. 🌳 **Stage 2: Deep Forest (깊은 숲)** — Mossy ancient oaks, peeking ears, and stepping stones across the bubbling river.
> 3. 🏡 **Stage 3: Cabin (오두막)** — White picket garden fence and hidden shelter under the wooden porch steps.
> 4. 🛏️ **Stage 4: Room (방 안 - Final Spot)** — Cozy woven blanket basket, patchwork quilt bed, and nightstand lamp where Bunny is finally caught and embraced with a warm hug!

On each page, the young learner:
1. **Listens** to synchronized read-aloud with word-by-word karaoke highlighting (Normal or Slow).
2. **Explores** underlined key words for instant (<0.5s) phonics sounds and animated visual explanations.
3. **Finds** Bunny either by tapping the hidden character directly in the lively illustration or selecting between 2 large image cards.
4. **Speaks** the page's sentence aloud in a mandatory `[Listen & Say]` voice repetition step with full-sentence speech completion verification before the app allows advancing.
5. **Collects** 4-stage passport stamps, builds an expressive sentence reaction card (*"I like Bunny!"*), and solves multi-layered sound mystery cases.

---

## 2. Target Users

| Category | Details |
| :--- | :--- |
| **Grade / Age** | Elementary Grade 1–2 (ages 7–8) |
| **English Level** | CEFR Pre-A1 Starter (50–100 basic sight words, 3–6 words per sentence) |
| **Usage Context** | 7–10 minutes of self-guided reading at home or in an after-school English class, in mobile or tablet portrait orientation |
| **Prior Experience** | Can recognize alphabet letters and basic phonics sounds; learning spatial prepositions (*into, behind, across, by, under, in*) through progressive visual storytelling |

---

## 3. Problem & Learning Objective

* **Problem:** Static digital PDFs and one-way read-aloud videos fail to sustain attention for 7–8 year-olds. Crucially, generic voice apps often praise prematurely after detecting any sound or half a word, leaving learners without proper feedback on whether they completed the entire sentence.
* **Learning Objective (Can-Do Statement):** 
  - *Comprehension:* By completing the 4-stage chase story (8 pages, 2 pages per stage, 3–6 words per sentence), the learner understands key spatial prepositions (*into, behind, across, by, under, in*) and animal vocabulary with 90%+ comprehension.
  - *Full-Sentence Speaking Output:* The learner orally repeats each page's sentence in the mandatory `[Listen & Say]` checkpoint from the first word to the last word. Praise audio triggers strictly upon full-sentence completion.
  - *Auditory Discrimination:* The learner identifies animals and environmental settings through multi-layered sound clues (ambient background + animal vocalization).

---

## 4. Core Features (Priority Order)

1. **4-Stage Progressive Storyline (Bunny's Chase)**
   - 8 story pages balanced evenly across 4 distinct stages (2 pages per stage):
     - **Stage 1: Forest Entrance (Pages 1–2)**:
       - Page 1: *"Where is little Bunny?"* (Meadow arch)
       - Page 2: *"Bunny runs into the forest!"* (Trail signpost)
     - **Stage 2: Deep Forest (Pages 3–4)**:
       - Page 3: *"Bunny is behind the tree."* (Ancient oak)
       - Page 4: *"Bunny is across the river."* (Stepping stones)
     - **Stage 3: Cabin (Pages 5–6)**:
       - Page 5: *"Bunny is by the fence."* (Picket fence)
       - Page 6: *"Bunny goes under the porch."* (Porch steps)
     - **Stage 4: Room (Pages 7–8 - Final Spot)**:
       - Page 7: *"Bunny is in the basket."* (Hearthside basket)
       - Page 8: *"Caught you! Happy Bunny!"* (Quilt bed, gentle catch & hug)

2. **Touch & Sync Read-Aloud with Word Highlighting**
   - Synchronized audio narration with dynamic glowing word badges.
   - Dual speed toggle: `[🐰 Normal]` (0.95x) and `[🐢 Slow]` (0.72x) calibrated for early learners.

3. **One-Tap Visual & Phonics Dictionary**
   - Tapping any underlined key word displays segmented letter sounds, animated visual diagrams, and example sentences within 0.5 seconds without navigating away.

4. **Interactive Find-the-Animal Question**
   - Voice-guided question (e.g., *"Where is Bunny hiding?"*).
   - Dual response options: tap Bunny directly in the SVG scene OR select one of 2 large picture cards.
   - Immediate feedback: star animation, cheerful chimes, and stamp unlocked.

5. **Mandatory `[Listen & Say]` with Speech Completion Check**
   - Before advancing, an interactive speech practice card prompts the learner to repeat the sentence aloud.
   - **Speech Completion Verification Logic:**
     - Live word-by-word tracking matches the learner's spoken words.
     - **No Premature Praise:** Praise audio (*"Great job!", "Well done!"*) is strictly prevented while the user is still speaking or if they stop mid-sentence.
     - If the learner stops early or misses words, the app provides gentle guidance: *"Keep going! Say the whole sentence: '...' "*
     - Praise fanfare and the Speaking Star ⭐ are awarded **ONLY AFTER** the learner has spoken the entire sentence to completion, which then unlocks the `[Next ►]` button.

6. **Richer & Expanded Sound Mystery Game**
   - 3-Case Sound Mystery Detective combining:
     - **Layer 1 (Ambient Background):** Rustling forest leaves, creaking wooden doors, bubbling river stream.
     - **Layer 2 (Animal Vocalization):** Bluebird chirp, Frog croak, Calico Cat purr/meow.
     - **Layer 3 (Progressive Audio Clues):** *"Who is hiding behind the cabin door?"* with separate and combined playback.

7. **Visually Rich Picture-Book Cover Screen with Non-Obstructing Bush Tap UI**
   - Hardcover picture-book aesthetic with parchment paper framing, gold-embossed corners, and dynamic animated title typography.
   - Interactive preview elements:
     - **Non-Obstructing Bush Tap:** Tapping the bush triggers rustling audio, Bunny peeks out with twitching ears, and the dialogue bubble appears **strictly above Bunny** in the top scene banner so that Bunny's face and ears are **NEVER covered, blocked, or hidden by text**.
     - Tappable directional signpost cycling through the 4 stages with creaking wood sounds.
     - Oversized, pulsating golden `[Start Story 📖]` button.

---

## 5. Screen Layout & Navigation Flow

### ① Visually Rich Cover Screen
* **Cover Frame:** Hardcover picture book border, gold corner filigree, and subtitle plaque.
* **Animated Title:** Bouncing letter typography for **"Where is Bunny?"** with star sparkles.
* **Interactive Elements:**
  - Tappable bush: triggers rustling audio, Bunny peeks out, and speech bubble pops in a dedicated banner above the scene (Bunny's face is 100% visible and unblocked).
  - Tappable wooden signpost cycling through the 4 stages: `🌲 Forest Entrance` ➔ `🌳 Deep Forest` ➔ `🏡 Cabin` ➔ `🛏️ Room`.
  - Woodland characters that make friendly greeting sounds when tapped.
* **Action Buttons:**
  - Oversized pulsating `[Start Story 📖]` button.
  - Secondary `[Sound Mystery Detective 🎧]` launcher.

### ② Story Page Screen (Pages 1–8 across 4 Stages)
* **Stage Tracker (Top):** Active stage badge (e.g. `📍 Stage 2/4 • Deep Forest (깊은 숲)`) + footprint counter (`Page 3 / 8`).
* **Interactive Scene (Top 60%):** Rich SVG illustration with responsive animals and hidden Bunny.
* **Story Text Card (Center):** 1 short sentence with underlined key words.
* **Audio Controls & Question Bar:**
  - `[🔊 Read]` button and `[🐢 Slow]` speed toggle.
  - Find-the-animal question with 2 large picture cards (or tap Bunny directly).
* **Speaking Checkpoint (`[Listen & Say]`):**
  - Interactive speech recorder with real-time word matching.
  - Progress indicator displaying spoken words (e.g., `3 / 5 words`).
  - Strict completion gate: praise sounds only trigger once all words are completed.

### ③ Multi-Layered Sound Mystery Game Modal
* **Case Selector:** 3 mystery cases (Forest Trail, Riverbank, Behind Cabin Door).
* **Sound Mixer:** Independent buttons for Environment sound, Animal voice, and Master layered playback.
* **Clues & Choices:** Progressive clues and 3 picture choices.

### ④ Result Screen
* **Score & Stage Ribbon:** `You collected 8 / 8 Chase Stamps across all 4 stages!`
* **Passport Review:** 8 collected animal stamps organized by the 4 stages.
* **Sentence Reaction Card:** Sticker tray + *"I like [Animal]!"* builder with loud speaker cheer.
* **Actions:** `[Read Again 🔄]` and `[Sound Mysteries 🎧]`.

---

## 6. Completion Criteria ("This is success!")

- [x] Story follows a clear 4-stage progression: Forest Entrance → Deep Forest → Cabin → Room.
- [x] Every page's audio read-aloud keeps exact synchronized word highlighting at both Normal (0.95x) and Slow (0.72x) speeds.
- [x] Tapping any underlined word displays phonics breakdown and animated visual dictionary within 0.5 seconds.
- [x] Finding questions can be solved by tapping Bunny in the scene OR selecting the correct picture card.
- [x] Speaking step strictly verifies that the ENTIRE sentence has been spoken before triggering praise audio or unlocking `[Next ►]`. No premature praise while speaking or if stopped mid-sentence.
- [x] The sound game features multi-layered audio (ambient environment + animal calls) and progressive clues.
- [x] Cover screen features interactive rustling bushes where Bunny peeks out with a dialogue bubble placed strictly above Bunny so the face is never covered.
- [x] Result screen displays the 8 stamps, builds the spoken reaction card, and runs without adult assistance within 10 minutes.
