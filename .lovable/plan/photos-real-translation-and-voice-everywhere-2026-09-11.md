# Photos, real translation, and voice everywhere

The app is now running here with its database. Three things need work.

## 1. Photo: take and upload

The camera and upload buttons already open the phone camera or gallery, shrink the photo, and send it to AI for labelling. What is missing is proof that it works and a few rough edges:

- Test both paths end to end and confirm AI labels come back (name, category, material, colour, size, description).
- Show a clear message when a photo is unreadable, too big, or the AI is busy, instead of a silent failure.
- Keep the chosen photo visible even if labelling fails, so nothing is lost.
- Make sure the saved product carries the real photo through to the catalogue, product page and store.

## 2. Everything shows in the chosen language

Today only a short hand-written word list is translated, so most of the dashboard stays English. Fix:

- Add an automatic translation service: any English text on screen is translated into the chosen language by AI, then remembered so it is instant next time and works offline afterwards.
- Keep the existing hand-written words as the trusted first source (correct craft/business wording), and let AI fill every gap.
- Show the chosen language as the main line with small English underneath, so the screen reads in the user's own language while remaining usable for anyone who reads English. (Today it is the other way round.)
- Apply this to the whole dashboard — health score rows, quick actions, snapshot cards, section titles, badges, assistant prompts, buttons and toasts — and to every other screen through the shared label component.
- Switching language in the top bar updates every screen immediately.

## 3. Voice input at every stage

Voice already records and transcribes on onboarding, add product and two AI Studio screens. To finish:

- Add real voice recording to the AI helper chat (the mic there currently sends a fixed sentence).
- Add voice to the remaining places people type: product details fields, order notes, customer notes, and the search box.
- Speak in any supported language; the words come back in that language and fill the field.
- Clear feedback: listening, sound level, writing your words, and a plain message when the microphone is blocked or nothing was heard.
- Test the transcription service with real spoken audio in English and Hindi.

## Technical notes

- New `src/lib/translate.functions.ts` server function batches missing strings to Lovable AI (`google/gemini-3.8-flash`) with a strict JSON response, per language.
- New translation provider caches results in memory plus `localStorage` per language; `Bi`/`BiInline` and the dashboard's `t()`/`localLine()` calls route through it so nothing stays English.
- Voice reuses the existing `useVoiceRecorder` + `transcribeBusinessVoice` (`google/gemini-3.5-transcribe`); the shared `VoiceButton` is dropped into remaining inputs.
- Verification with Playwright against the running app: upload a photo, switch language, and check no untranslated dashboard text remains.
