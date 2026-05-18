# SignBridge

Real-time bidirectional communication bridge between Sign Language and spoken/written language.

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │    Backend      │     │  ML Inference   │
│   (Next.js)     │◄───►│   (FastAPI)     │◄───►│  (TensorFlow/    │
│                 │     │                 │     │   MediaPipe)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
  WebRTC Stream         /translateGesture        Hand Landmark
  Accessibility         /translateText           Detection &
  Bilingual UI        Audio/Speech              Gesture Recognition
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TailwindCSS |
| Backend | FastAPI, Uvicorn |
| ML Core | TensorFlow, PyTorch, MediaPipe, OpenCV |
| Deployment | Docker, Docker Compose |

## Installation

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Quick Start (Docker)

```bash
docker-compose up -d
```

Access the application at `http://localhost:3000`

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### POST `/api/v1/translateGesture`

Translate sign gesture to text and speech.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image/jpeg)

**Response:**
```json
{
  "text": "hello",
  "gesture": "hello",
  "confidence": 0.92,
  "audio_base64": "base64 encoded audio..."
}
```

### POST `/api/v1/gesture/stream`

Process video stream for real-time detection.

**Response:**
```json
{
  "landmarks": [{"handedness": "right", "landmarks_count": 21}],
  "text": "hello",
  "confidence": 0.88
}
```

### GET `/api/v1/translateGesture/high-frequency`

Get high-frequency gesture list for offline mode.

### POST `/api/v1/translateText`

Translate text to sign language animations.

**Request:**
```json
{
  "text": "hello how are you",
  "language": "en"
}
```

**Response:**
```json
{
  "original_text": "hello how are you",
  "language": "en",
  "sign_sequence": [
    {"word": "hello", "sign_data": {"animations": ["wave"], "icons": ["hand_wave"]}}
  ],
  "avatar_animations": ["wave"]
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Frontend API URL |
| `MODEL_PATH` | `./ml/models` | ML model directory |
| `ALLOWED_ORIGINS` | localhost origins | CORS allowed origins |

## Model Training Lineage

The gesture recognition model was trained on a custom dataset of Indian Sign Language gestures using:

1. **Data Collection**: MediaPipe hand landmark extraction from video recordings
2. **Feature Engineering**: Normalized 3D coordinates (x, y, z) for 21 landmarks per hand
3. **Model Architecture**: LSTM with 2 layers (128 units each) + Dense classifier
4. **Training**: 50 epochs, Adam optimizer, categorical crossentropy loss
5. **Export**: Saved as TensorFlow SavedModel format

## Deployment

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Setup

1. Update `nginx.conf` with your domain
2. Set environment variables in `.env` file
3. Run `docker-compose -f docker-compose.yml up -d`

## License

MIT License

## Model Training

### Google Colab Notebook

A training notebook is provided at [`colab/SignBridge_Training.ipynb`](colab/SignBridge_Training.ipynb) that includes:

1. Environment setup with all required libraries
2. Dataset preparation (ASL + ISL hybrid)
3. CNN model training with accuracy/loss visualization
4. Model export (H5, TFLite, ONNX formats)
5. Inference demo with `predict_gesture(frame)` function
6. FastAPI integration snippets

To train the model:

1. Open the notebook in Google Colab
2. Mount Google Drive for model storage
3. Run all cells sequentially
4. Download trained model files and place in `ml/models/`