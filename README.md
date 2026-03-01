# Slangify-Studio

Slangify‑Studio is an interactive web application built with [Next.js](https://nextjs.org) that allows users to search for, explore, and listen to English slang terms. The UI is powered by Tailwind CSS and a collection of custom UI components, with a focus on accessibility and a playful experience.

## Features

- **Search bar** with live suggestions for slang terms
- **Trending slangs** carousel on the homepage
- **Slang cards** showing definitions and example usage
- **Audio playback** for pronunciation using the Web Audio API
- **Dark/light themes** respecting user preference
- **Responsive design** optimized for desktop and mobile

## Getting Started

Clone the repo and install dependencies:

```bash
git clone <repo-url> slangify-studio
cd slangify-studio
npm install      # or yarn / pnpm / bun
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The page will reload as you make edits, and you can modify files under `src/app` to experiment with the layout.

## Project Structure

```
src/
  app/                  # Next.js App Router pages & layouts
  components/           # Reusable UI components
  data/slang.json       # Slang dictionary data
  hooks/                # Custom React hooks
  lib/                  # Utility functions
```

## Scripts

- `npm run dev` – start development server
- `npm run build` – create production build
- `npm run start` – serve the production build
- `npm run lint` – run ESLint

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to add features, improve performance, or fix bugs. Please follow the existing code style and run `npm run lint` before submitting.

## License

This project is licensed under the [MIT License](LICENSE).
