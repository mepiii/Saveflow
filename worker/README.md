# SaveFlow Worker

Local media worker scaffold for FFmpeg, transcription, summaries, and export stages.

## Run

```bash
cd worker
uv run --with-editable . saveflow-worker doctor
uv run --with-editable . saveflow-worker run-once sample-job.json
```

## Runtime knobs

```bash
ML_DEVICE=auto|cpu|cuda
MODEL_PROVIDER=local|gemini|openai
LOCAL_MODEL_NAME=base
FIREBASE_PROJECT_ID=your-project-id
```

## Contract

Jobs use `saveflow_worker.contracts.MediaJob`. Results use `WorkerResult`. Current scaffold validates contract and returns a deterministic complete result. Future implementation should replace stub stages with FFmpeg, faster-whisper, and provider-backed summary steps.
