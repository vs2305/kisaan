# Kisan Suraksha

**A voice-guided pesticide safety check for farmers, in Hindi, Marathi and English.**

Kisan Suraksha (किसान सुरक्षा) lets a farmer photograph the coloured toxicity square on a pesticide pack, or simply tap the colour, and immediately see and *hear* how dangerous the product is, which precautions to take, and what to do if someone is poisoned.

It is a single-page Progressive Web App with no backend, no accounts and no build step. It runs entirely on the phone and keeps working without an internet connection once it has been opened.

> **Status:** prototype. See [Limitations and disclaimer](#limitations-and-disclaimer).

---

## Features

- **Photo or colour pick.** Take a photo of the pack with the camera, upload one from the gallery, or choose the colour directly from four swatches.
- **Tap-to-identify.** Tap the coloured mark in the photo; the app samples a small patch around the tap and classifies its hue as red, yellow, blue or green.
- **Four toxicity bands.** Each result shows the band name, a one-line warning and a four-step severity gauge:

  | Colour | Meaning |
  | ------ | ------- |
  | Red | Extremely toxic |
  | Yellow | Highly toxic |
  | Blue | Moderately toxic |
  | Green | Slightly toxic |

- **Read-aloud guidance.** The result is spoken automatically: the toxicity band, the precautions, then the emergency steps. Pause, resume and stop controls are provided.
- **Three languages.** Hindi (default), Marathi and English, switchable from the header at any time. All text, labels and speech follow the selected language.
- **Illustrated precautions.** Every precaution and emergency step has an icon, so the guidance is usable even if the reader is not comfortable with text.
- **Offline-capable and installable.** A service worker caches the app, and a web manifest lets it be added to the home screen and launched full-screen.
- **Private by design.** Photos are drawn to an in-page canvas and never uploaded. The app makes no network requests of its own and stores nothing.

## How it works

1. **Colour classification.** The tapped patch (about 20 × 20 px, on an image scaled to at most 640 px wide) is averaged and converted from RGB to hue/saturation/value. Greyish or dark patches are rejected; otherwise the hue is matched to a band. If no band matches, the user is asked to retake the photo in daylight or pick a colour manually.
2. **Speech.** Guidance is read with the browser's built-in [Web Speech API](https://developer.mozilla.org/docs/Web/API/Web_Speech_API) (`speechSynthesis`), so no audio files or cloud services are needed. The text is queued in short chunks of roughly one phrase each.
3. **Pause and resume.** Native `pause()`/`resume()` is unreliable on Android, so pausing cancels the current utterance and remembers the position. Resume continues from the last spoken word where the speech engine reports word boundaries, and otherwise replays only the current short phrase.
4. **Marathi voice fallback.** If the device has no Marathi voice installed, the app reads the Marathi text with a Hindi voice and shows a short notice saying so.
5. **Offline.** `sw.js` fetches from the network first and falls back to its cache, so an installed copy keeps working with no signal while still picking up updates when online.

## Project structure

```
kisaan/
├── index.html      # The whole app: markup, styles, translations, illustrations and logic
├── manifest.json   # PWA manifest (name, icons, standalone display, Hindi default language)
├── sw.js           # Service worker for offline use
└── README.md
```

There are no dependencies, no package manager and no build tooling.

## Getting started

### Run locally

The service worker and camera access require a secure context, so serve the folder over `http://localhost` rather than opening the file directly.

```bash
# from the project folder
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static file server works (`npx serve`, `caddy file-server`, and so on).

### Deploy

Upload the three files (`index.html`, `manifest.json`, `sw.js`) to any static host served over **HTTPS**, such as GitHub Pages, Netlify, Cloudflare Pages or an ordinary web server. Keep them in the same folder; the app resolves everything relative to its own location, so it also works from a sub-path.

### Install on a phone

Open the deployed URL in Chrome on Android and choose **Add to Home screen** (or **Install app**). On iOS Safari use **Share → Add to Home Screen**.

## Customising

| To change | Edit |
| --------- | ---- |
| Wording, or add a language | The `L` (UI text and precautions), `C` (toxicity bands), `UP` and `CT` (button labels) objects near the top of the script in `index.html`, plus the language buttons in the header |
| Colour detection thresholds | The `classify()` function in `index.html` |
| Speech rate or chunk length | `u.rate` in `say()` and `MAXC` in `index.html` |
| App name, icons, theme colours | `manifest.json` |

**When you change any file, bump the `CACHE` version string in `sw.js`** (for example `kisan-suraksha-v3` → `v4`) so that devices that already cached the app drop the old copy.

## Browser support

| Capability | Needs |
| ---------- | ----- |
| Core app, colour swatches | Any modern mobile or desktop browser |
| Read-aloud | A browser with `speechSynthesis` and at least one voice installed for the chosen language |
| Camera capture | A device camera and a secure (HTTPS or localhost) origin |
| Offline and install | Service worker and web manifest support (Chrome, Edge, Samsung Internet, Safari) |

Voice quality and availability depend on the speech engine on the device. On Android, installing the Hindi and Marathi voice data from the system text-to-speech settings gives the best result.

## Limitations and disclaimer

- **This is a prototype and an aid, not an authority.** Always read and follow the instructions printed on the pesticide label and packaging. The guidance in the app is general and does not replace the manufacturer's directions or advice from a doctor or poison information centre.
- **Colour detection is approximate.** It depends on lighting, print quality and where the user taps. When it fails or is uncertain, use the colour swatches instead.
- **In an emergency, call 112** and take the person and the pack to a hospital immediately. The app says this, but it is not a substitute for medical help.
- The guidance texts, particularly the Hindi and Marathi translations, should be reviewed by an agricultural safety or medical professional before any wide public release.

## Contributing

Issues and pull requests are welcome, especially for translation review, additional languages and accessibility improvements. Please keep the project dependency-free and test changes on a real Android device, since speech and camera behaviour differ between phones.
