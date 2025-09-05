# 🎨 AI Studio

A small React + TypeScript web app that simulates a simplified AI design studio.  
Built as part of the **Senior Front-End Engineer coding assignment** for Modelia.

---

## 🚀 Features

- **Upload & Preview**
  - Upload PNG/JPG images (≤10MB).
  - Client-side **downscale to ≤1920px** for oversized images.
  - Preview and remove uploaded image.

- **Prompt & Style**
  - Textarea for writing prompts (up to 500 chars).
  - Style selector with 3+ style options (Editorial, Streetwear, Vintage, etc.).
  - Live summary displayed in "Your Creation".

- **Generate (Mock API)**
  - Fake API simulates 1–2s delay.
  - Returns `{ id, imageUrl, prompt, style, createdAt }`.
  - **20% failure chance** with `"Model overloaded"`.
  - Retries automatically with **exponential backoff** (max 3).
  - User can **Abort** request anytime.

- **History**
  - Last 5 generations stored in **localStorage**.
  - Grid of recent creations with click-to-restore.

- **Accessibility**
  - Keyboard navigation with visible focus states.
  - ARIA-friendly labels, roles, and live regions.

- **UI/UX**
  - TailwindCSS styling.
  - Subtle animations (fade, scale).
  - Responsive layout and clean design.

---

## 🛠️ Tech Stack

- **React + TypeScript** (Vite)
- **TailwindCSS**
- **Lucide-react icons**
- **Custom hooks + utilities**
- ESLint + Prettier (strict mode)

---


## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd <your-repo>
npm install
