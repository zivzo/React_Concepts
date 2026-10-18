# React Fieldnotes

A small, hands-on app for learning React's most useful concepts. Follow eight short lessons, then put them into practice in a task tracker.

## Run the app

You need Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Google AdSense banners

The app has a left and a right banner (160×600) that appear beside the content on screens at least 1280px wide. On smaller screens the banners are not rendered, so the lessons keep the full width.

1. Create two display ad units (160×600 “Wide Skyscraper”) in your [AdSense account](https://www.google.com/adsense/).
2. Copy `.env.example` to `.env.local` and fill in your publisher ID and ad unit IDs:

   ```bash
   VITE_ADSENSE_CLIENT=ca-pub-1234567890123456
   VITE_ADSENSE_SLOT_LEFT=1234567890
   VITE_ADSENSE_SLOT_RIGHT=0987654321
   ```

3. Run `npm run build`. When `VITE_ADSENSE_CLIENT` is set, the build adds the AdSense script and the `google-adsense-account` meta tag to `index.html`, and creates an `ads.txt` file in `dist/`. Deploy `dist/` to the root of your domain.

Without `VITE_ADSENSE_CLIENT`, the app builds with no ads. While running `npm run dev`, labelled placeholders show where the banners will go; ads served during development are marked as test ads. If you serve visitors in the EEA, UK, or Switzerland, Google requires a certified consent management platform — you can turn one on in AdSense under **Privacy & messaging**.

## Learn by doing

Choose **Learn the concepts** to explore components and JSX, props, state and events, lists and keys, forms, derived state, effects, and context, reducers, and custom Hooks. Each lesson includes a short explanation, a code example, and a challenge. Use **Previous** and **Next concept** to move through the path, and mark lessons as learned to keep track of your progress.

Choose **Code playground** (or **Try it live** on any lesson) to write React code yourself and see it render instantly. Every lesson has a runnable starter example with a challenge to try. Import Hooks from `"react"` and `export default` the component you want to preview; syntax and rendering errors appear in the preview so you can fix them. Your code for each example is saved in this browser, and **Reset** brings back the original. The code runs in this page, so avoid infinite loops — they can freeze the tab.

Choose **Build the app** to try those ideas in the task tracker. Add, complete, filter, and remove tasks; tasks and your light/dark theme are saved in this browser.

The app is intentionally built with React fundamentals: lesson content is rendered from data, the tracker uses a reducer and custom Hook, theme is shared with context, and progress and tasks are persisted with effects. Explore `src/` and change the app as you learn.

## Further learning

- [React Learn](https://react.dev/learn) — the official interactive tutorial and concept guides
- [Thinking in React](https://react.dev/learn/thinking-in-react) — a step-by-step approach to building a UI
- [React reference](https://react.dev/reference/react) — API details for components and Hooks
