# Contributing to SignBridge 🫶

First off, thank you for considering contributing to SignBridge! You're about to help bridge the communication gap between sign language and spoken language. That's pretty cool. *You're* pretty cool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What Kind of Contributions We Love](#what-kind-of-contributions-we-love)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [A Note on Docker](#a-note-on-docker)

---

## Code of Conduct

Don't be a jerk. Be excellent to each other. That's it. If you need more detail, imagine the golden rule but in sign language.

---

## What Kind of Contributions We Love

### 🐛 Bug Fixes
Something broken? Found a bug? We appreciate you. Open an issue, then fix it. Double points if you add a test.

### ✨ New Features
Got an idea that would make SignBridge better? Open an issue first so we can discuss it — we don't want you building something we'll have to gently but painfully decline.

### 📖 Documentation
Found a typo? A confusing sentence? The README not funny enough? (It's pretty funny, let's be honest.) Open a PR and make it better.

### 🌐 Translations
We currently support English and Hindi. Want to add another language? You're a hero.

### 🧪 Tests
We like tests. Tests are friends. If you see untested code, adopt it.

### 🎨 UI/UX
The app should look good *and* work well. If you have designer chops, we need you.

---

## Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of this page. Congratulations, you now own a copy of SignBridge.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/Sign-Bridge.git
cd Sign-Bridge
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/RakshitKashyap1/Sign-Bridge.git
```

This lets you sync your fork with the original repo when things change upstream.

### 4. Set Up Development Environment

**Option A: Docker (Recommended)**
```bash
docker-compose up -d
```
Everything runs at `http://localhost:3000`. Magic.

**Option B: Local Masochism**

*Backend:*
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

*Frontend:*
```bash
cd frontend
npm install
npm run dev
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/your-amazing-feature
```

Branch naming convention:
- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation
- `refactor/` — code improvements that don't change behavior
- `test/` — adding or fixing tests
- `chore/` — maintenance tasks

### 2. Make Your Changes

Write code. Be proud of it. If you're not proud, rewrite it until you are.

### 3. Test Your Changes

**Frontend:**
```bash
cd frontend
npm run build    # This lints AND type-checks AND builds. Three birds, one stone.
```

**Backend:**
```bash
cd backend
ruff check app/  # Python linting (if you have ruff installed)
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add the thing that does the thing"
```

### 5. Sync with Upstream

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push and Open a Pull Request

```bash
git push origin feat/your-amazing-feature
```

Go to GitHub, open a PR against `RakshitKashyap1/Sign-Bridge:main`, and fill out the template. Be descriptive. Tell us a story.

---

## Coding Standards

### General

- Keep it simple. The person who reads your code in 6 months might be you.
- Don't make us think. Clear > clever.
- If a function does more than one thing, it's probably two functions pretending to be one.

### TypeScript / JavaScript

- **Type everything.** We got rid of all the `any` types for a reason. Don't bring them back.
- Use proper interfaces. Your future self will thank you.
- Run `npm run build` before pushing. If it fails, fix it.
- Don't add comments that state the obvious (`// increment i by 1`). Do add comments that explain *why*.

### Python

- Follow PEP 8. Ruff will yell at you if you don't.
- Type hints are your friends. Use them.
- FastAPI routes should be async (because waiting is for buses, not APIs).

### CSS / Tailwind

- Use Tailwind utility classes. No custom CSS unless absolutely necessary.
- Responsive design isn't optional. Make it work on mobile too.

### Three.js / 3D

- The avatar is a sacred being. Treat it with respect.
- Keep animations smooth. Nobody likes a stuttering 3D figure.

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <brief description>

[optional body]
```

Types:
- `feat:` — A new feature
- `fix:` — A bug fix
- `docs:` — Documentation only
- `style:` — Formatting, missing semicolons, etc (no code change)
- `refactor:` — Code change that neither fixes a bug nor adds a feature
- `test:` — Adding missing tests
- `chore:` — Maintenance tasks

Examples:
```
feat: add real-time WebSocket gesture recognition
fix: resolve camera toggle race condition on mobile
docs: update README with funny jokes
refactor: extract animation engine into separate module
```

---

## Pull Request Process

1. **Ensure your PR builds cleanly.** `npm run build` should pass with zero errors and zero warnings.
2. **Keep PRs focused.** One feature/fix per PR. Don't sneak in unrelated changes — we *will* notice.
3. **Write a clear description.** What does this PR do? Why? How did you test it?
4. **Reference related issues.** If it fixes #42, say "Fixes #42".
5. **Be responsive.** We'll review your PR and might ask for changes. Don't ghost us.
6. **Squash commits if asked.** Sometimes we want a clean history. We'll let you know.

### Review Checklist

We'll be checking:
- [ ] Does the build pass? (`npm run build`)
- [ ] Are there no new `any` types?
- [ ] Is the code reasonably performant?
- [ ] Does it work on both desktop and mobile?
- [ ] Are there tests? (Not always required, but highly appreciated)

---

## A Note on Docker

If you're making Docker-related changes:
- Frontend uses `npm ci`, not `npm install` — this requires `package-lock.json` to exist
- Backend uses multi-stage builds (builder → runner) to keep images small
- If you add a dependency, regenerate the lockfile: `npm install --package-lock-only`
- Test your Docker changes locally: `docker-compose up --build`

---

## Questions?

Open an issue! We don't bite. (And even if we did, we'd sign it first.)

---

*Made with 🫰 and too much caffeine.*
