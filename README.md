# SignBridge 🫰

> *"I don't know sign language, but my computer does."*

**SignBridge** is a real-time sign language translation app that bridges the gap between signing and speaking — because your hands deserve to be heard, and your voice deserves to be seen.

Think Google Translate, but for your fingers. And it runs in your browser. And there's a 3D avatar that dances when you type "hello". 🕺

---

## What Does It Do?

| You do this... | SignBridge does that... |
|---|---|
| Wave at your camera | 🤖 → "Hello!" |
| Type "thank you" | 🤖 → Shows you the sign + 3D avatar bows |
| Speak into your mic | 🤖 → Transcribes AND signs it back |
| Flip your camera | 🤖 → Switches to selfie mode (the horror) |
| Make random hand gestures | 🤖 → "No hands detected" (rude but honest) |

### Features That Actually Work™

- ✋ **Gesture → Text/Speech**: Point your webcam at your hands, press translate, watch the magic
- ⚡ **Real-time Mode**: WebSocket-powered 5fps continuous recognition (like FaceTime but for your hands)
- 📝 **Text → Sign**: Type words, get sign language animations + a 3D avatar that performs them
- 🎤 **Speech → Sign**: Talk to your computer, it talks back in sign language
- 📚 **Vocabulary Builder**: Save your own custom gestures (finally, revenge for autocorrect)
- 💬 **Conversation Mode**: Split-screen chat — sign on one side, type on the other
- 📜 **History & Favorites**: Because forgetting things is the first sign of... wait, what were we talking about?
- 🌐 **Bilingual**: English and Hindi (more languages join the party soon)
- 📱 **PWA**: Install it like an app, use it offline (service workers: the unsung heroes)
- 🔄 **Camera Toggle**: Front camera, back camera, existential crisis about which one you look better in

---

## Tech Stack (Fancy Words Edition)

| Layer | What we used | Why |
|-------|-------------|-----|
| Frontend | Next.js 14, React 18, TailwindCSS, Three.js | Because recreating a human skeleton in JavaScript is a normal thing to do |
| Backend | FastAPI, Uvicorn, WebSockets | Python, but make it ✨fast✨ |
| ML Core | TensorFlow, MediaPipe, OpenCV | We taught a computer what hands look like. It was not easy. |
| 3D Magic | Three.js | A sphere with limbs that dances when you type |
| Deployment | Docker, GitHub Actions | Ships itself. Like Amazon, but free. |

---

## Quick Start (The "I want it NOW" approach)

### With Docker (recommended — 1 command, infinite satisfaction)

```bash
docker-compose up -d
```

Open `http://localhost:3000` and start waving. The computer is watching.

### Without Docker (for people who enjoy `pip install` drama)

**Backend:**
```bash
cd backend
pip install -r requirements.txt  # ☕ go make coffee, this takes a while
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install          # 📦 downloads the entire internet
npm run dev
```

**Then:**
1. Point your browser at `http://localhost:3000`
2. Allow camera access (yes, we promise not to judge)
3. Make a hand gesture
4. Receive translation
5. Feel like you're living in the future
6. Go back to step 3

---

## API Endpoints (For the Curious)

### POST `/api/v1/translateGesture`
Send a picture of your hand. Get words back. It's that simple.

### POST `/api/v1/translateText`
Type words. Get sign animations. The 3D avatar thanks you for giving it purpose.

### WebSocket `/api/v1/ws/gesture`
Real-time frame streaming. Like a video call, but the other person is a machine learning model that's very good at guessing.

### POST `/api/v1/translateSpeech`
Talk. Let the computer figure out what you meant. It's better than most humans at this.

### POST/GET/DELETE `/api/v1/vocabulary/*`
Build your own gesture dictionary. Become the Shakespeare of sign language.

---

## Environment Variables (Don't touch unless you know what you're doing)

| Variable | Default | What it does |
|----------|---------|--------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Where the frontend yells at the backend |
| `MODEL_PATH` | `./ml/models` | Where we keep the brain |
| `ALLOWED_ORIGINS` | localhost | Who's allowed to talk to our APIs (strangers not welcome) |

---

## The Model Training Saga

Our gesture recognition model learned to see hands the hard way — through 50 epochs of TensorFlow sweat and tears:

1. **Data Collection**: MediaPipe extracted 21 hand landmarks from hours of video (the computer's eyes hurt)
2. **Feature Engineering**: Normalized 3D coordinates — basically telling the computer where hands exist in space
3. **Model**: LSTM with 2 layers (128 units each) — it's basically a very small, very specialized fortune teller
4. **Training**: 50 epochs, Adam optimizer, categorical crossentropy — we fed it signs until it dreamed in sign language
5. **Dataset**: Indian Sign Language + a dash of ASL — the multilingual, multitalented model

Want to train your own? Check out [`colab/SignBridge_Training.ipynb`](colab/SignBridge_Training.ipynb) and prepare to watch a computer learn the alphabet.

---

## Contributing

We're so glad you asked! Check out [CONTRIBUTING.md](CONTRIBUTING.md) for the full scoop. But here's the short version:

1. Fork it
2. Branch it
3. Code it
4. PR it
5. We merge it
6. Party 🎉

---

## License

MIT. Do whatever you want with it. Just don't blame us if your computer starts making shadow puppets at 3 AM.

---

## Fun Facts

- This README is 100% more entertaining than most enterprise documentation
- The 3D avatar has never complained about a deadline
- We spent more time on this README than on model training, and it shows
- If you read this far, you should probably just [contribute](CONTRIBUTING.md) already
