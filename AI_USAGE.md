# 🤖 AI_USAGE.md

This document explains how AI tools were used during the development of **AI Studio**.

---

## 🛠️ Tools Used

- **ChatGPT (OpenAI GPT-5)**  
  - Used for brainstorming architecture and UI/UX flow.  
  - Helped write component scaffolding (`Navigation`, `ChatInterface`, `AIStudio`).  
  - Provided explanations for state management patterns (retry logic, abort controllers).  
  - Generated install/run/test documentation and design notes.  

- **Claude Sonnet 4**  
  - Assisted with rewriting complex logic into simpler, more readable code.  
  - Provided alternative approaches for retry logic and error handling.  

- **GitHub Copilot & Windsurf**  
  - Suggested quick JSX/Tailwind class utilities.  
  - Provided inline completions for TypeScript props and interfaces.  
  - Fixed small inline errors during development.  

- **DeepSeek**  
  - Assisted with performance-focused code suggestions and optimizations.  
  

---

## 🚀 How AI Helped in Development

1. **Coding**  
   - Generated React components with consistent TypeScript props.  
   - Auto-completed TailwindCSS utility classes for complex layouts.  
   - Suggested animation transitions (`FadeInUp`, `ScaleIn`) quickly.  

2. **Debugging**  
   - Identified mistakes with resetting file input refs after upload.  
   - Simplified retry logic in the mock API with clearer error handling.  
   - Flagged unnecessary re-renders in animation components.  

3. **Testing**  
   - Suggested manual test scenarios (image upload, prompt validation, abort flow).  
   - Recommended libraries (`@testing-library/react`, `jest`) for automated testing.  

4. **Automation**  
   - Drafted PR descriptions and commit messages.  
   - Generated installation and contribution docs (README, this AI_USAGE file).  

---

## ⚖️ Transparency & Limits

- AI did **not** write the entire codebase; it accelerated parts of it.  
- All outputs were reviewed and modified by the developer before committing.  
- Business logic, UI polish, and final decisions were human-driven.  

---

✅ Result: AI tools reduced dev time, improved iteration speed, and supported clearer documentation, while human oversight ensured correctness and quality.
