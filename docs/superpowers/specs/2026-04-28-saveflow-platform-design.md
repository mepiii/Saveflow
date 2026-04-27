# SaveFlow Platform Design

## Summary

SaveFlow is a dual-mode media intelligence platform. It can run as a free-deploy SaaS with Vercel and Firebase, and it can run locally on low-spec computers with optional CPU or GPU acceleration.

The product lets users upload media, convert formats, generate transcripts and subtitles, summarize content, tag media, and export results. Social link import stays out of the MVP and returns later as permission-based adapters.

## Goals

- Build a portfolio-grade full-stack ML product, not a simple downloader.
- Support free hosted deployment without requiring paid Supabase or high-cost infrastructure.
- Support local processing on low-spec machines with CPU defaults and GPU optional acceleration.
- Keep heavy FFmpeg and ML work outside Vercel API routes.
- Make worker status, job progress, and missing setup steps clear in the UI.
- Let users choose local models, Gemini, or OpenAI for AI features.

## Non-Goals

- Do not bypass DRM, paywalls, private accounts, login walls, or platform protections.
- Do not build anonymous scraping or mass import features.
- Do not require a high-performance GPU for local use.
- Do not require cloud ML workers for the hosted app to function.
- Do not include full social link import in the MVP.

## Architecture

```text
Next.js on Vercel
  ├─ Landing page
  ├─ Authenticated app routes
  ├─ Upload, library, media detail, settings
  ├─ Firebase Auth
  ├─ Firestore metadata and jobs
  ├─ Firebase Storage media and outputs
  └─ Worker/job dispatcher

Python Worker
  ├─ Local mode: CPU default, GPU optional
  ├─ Cloud mode: optional cheap/free worker host
  ├─ FFmpeg and FFprobe processing
  ├─ faster-whisper transcription
  ├─ Subtitle generation
  ├─ Local summary/tag provider
  ├─ Gemini/OpenAI optional providers
  └─ Qdrant optional vector search later
```

The hosted app remains useful without a worker. Users can authenticate, upload files, browse the library, manage settings, and queue jobs. If no worker is connected, jobs stay queued and the UI explains the missing worker.

## Deployment Model

### SaaS Mode

- Vercel hosts the Next.js app.
- Firebase Auth handles sign-in.
- Firestore stores media metadata, job records, outputs, and user settings.
- Firebase Storage stores uploads and generated files.
- A Python worker can run on Render, Railway, Fly, another low-cost host, or a user's machine.
- Gemini/OpenAI features use user-provided API keys.

### Local Mode

- The same Next.js app can run locally.
- The Python worker runs locally with a virtual environment or Docker.
- The worker defaults to CPU and small models.
- GPU acceleration is optional.

Worker configuration:

```text
ML_DEVICE=auto|cpu|cuda
LOCAL_MODEL_PROFILE=tiny|base|small
AI_PROVIDER=local|gemini|openai
```

Device behavior:

- `auto`: use CUDA when available, otherwise CPU.
- `cpu`: force portable CPU mode.
- `cuda`: require GPU and fail with a clear setup error if unavailable.

## MVP Scope

The MVP should prove the full product loop: upload, process, understand, export.

MVP features:

1. Landing page.
2. Firebase authentication.
3. Dashboard.
4. Video, audio, and image upload.
5. Firebase Storage persistence.
6. Firestore media records.
7. Media library.
8. Media detail page.
9. Worker connection status.
10. Firestore-backed job queue.
11. Video/audio conversion with FFmpeg.
12. Audio/video transcription.
13. SRT, VTT, TXT, and JSON exports.
14. Summary and tags with local, Gemini, or OpenAI provider.
15. Keyword search.
16. Output downloads.
17. Settings for API keys, AI provider, worker token, and local worker setup.

Deferred features:

- Social link import.
- Semantic search.
- Hook analyzer.
- Content quality score.
- Audio quality score.
- Smart thumbnail ranking.
- Duplicate detection.
- Batch processing.
- Team SaaS features.

## Data Model

Firestore collections:

```text
users/{userId}
  displayName
  email
  plan
  createdAt

users/{userId}/media/{mediaId}
  sourceType: upload|link
  mediaType: video|audio|image
  originalFileName
  mimeType
  storagePath
  thumbnailPath
  durationSeconds
  status: uploaded|queued|processing|complete|failed
  createdAt
  updatedAt

users/{userId}/jobs/{jobId}
  mediaId
  type: convert|transcribe|summarize|tag|subtitle|embed
  status: queued|claimed|running|complete|failed
  progress
  workerId
  input
  output
  errorMessage
  createdAt
  updatedAt

users/{userId}/outputs/{outputId}
  mediaId
  jobId
  outputType: audio|video|subtitle|transcript|summary|tags
  format
  storagePath
  metadata
  createdAt

users/{userId}/settings/private
  geminiApiKeyEncrypted
  openaiApiKeyEncrypted
  preferredAiProvider
  localWorkerTokenHash
```

Later semantic search uses Qdrant:

```text
collection: saveflow_media_embeddings
payload: userId, mediaId, title, tags, summary, transcriptChunk
```

## Job Flow

```text
1. User uploads a file in Next.js.
2. The file goes to Firebase Storage.
3. The app creates a media record in Firestore.
4. The user starts a processing job.
5. The app creates a job document with status=queued.
6. The Python worker watches or polls queued jobs.
7. The worker claims a job and writes status=claimed.
8. The worker downloads the input from Storage.
9. The worker runs FFmpeg or ML processing.
10. The worker uploads outputs to Storage.
11. The worker creates output records.
12. The worker marks the job complete or failed.
13. The UI watches Firestore and updates live.
```

Failure behavior:

- Worker offline: jobs remain queued.
- Low RAM: worker chooses a tiny model profile.
- No GPU: worker falls back to CPU in `auto` mode.
- No API key: worker uses local provider.
- No local model installed: worker returns a setup action instead of crashing.

## ML and Conversion Tiers

### Tier 0: No Worker

- Upload files.
- Browse library.
- Store metadata.
- Queue jobs.
- See setup instructions.

### Tier 1: Low-Spec Local CPU

- FFmpeg conversions.
- faster-whisper tiny/base transcription.
- SRT and VTT generation.
- TXT and JSON transcript export.
- Lightweight local summary and tag provider.

### Tier 2: Local GPU

- faster-whisper small or medium.
- Faster transcription.
- Better local embeddings and tag models.

### Tier 3: Optional API Provider

- Gemini/OpenAI summaries.
- Gemini/OpenAI tags.
- Suggested titles and key points.
- Later vision/audio analysis.

MVP conversion scope:

- Video to MP3.
- Video/audio to WAV.
- Video to compressed MP4.
- Transcript to TXT/JSON.
- Subtitle to SRT/VTT.

Later conversion scope:

- GIF export.
- Contact sheet.
- Burned subtitles.
- Batch ZIP export.

## UI/UX Direction

SaveFlow uses a Studio OS aesthetic.

Audience:

- Creators processing clips, transcripts, and exports.
- Students and researchers organizing media notes.
- Technical reviewers evaluating the ML pipeline.

Tone:

- Precise.
- Capable.
- Cinematic.

Theme:

- Dark-first.
- Accessible contrast.
- Muted media-studio surfaces.
- Rare warm amber/green status accents.

Avoid:

- Generic SaaS card grids.
- Cyan/purple AI gradients.
- Gradient text.
- Heavy glassmorphism.
- Decorative glows.
- Side-stripe card borders.

Core UI concept:

```text
Processing console
Uploaded → Converted → Transcribed → Summarized → Exported
```

Each media item should show a compact pipeline strip. The strip turns job state into a visible product object.

## Pages

### Landing Page

Purpose: explain SaveFlow as a media intelligence platform.

Sections:

- Hero.
- Upload-to-output workflow.
- SaaS and local worker modes.
- ML features.
- Responsible-use note.
- Demo CTA.

### Dashboard

Purpose: show system state.

Content:

- Storage usage.
- Active jobs.
- Recent media.
- Worker status.
- Failed setup actions.

### Upload Page

Purpose: start the core flow.

Content:

- Drag-and-drop upload.
- File validation.
- Processing options.
- Right-side processing rail.
- Worker readiness state.

### Library Page

Purpose: browse saved media.

Content:

- Grid/list toggle.
- Filters by media type, status, and tag.
- Keyword search.
- Pipeline state per item.

### Media Detail Page

Purpose: inspect, process, and export one item.

Content:

- Media preview player.
- Metadata.
- Job pipeline.
- Transcript and subtitles.
- Summary and tags.
- Output download buttons.

### Settings Page

Purpose: make setup clear.

Content:

- User profile.
- AI provider selection.
- Gemini/OpenAI key management.
- Worker token.
- Local worker setup command.
- CPU/GPU mode guidance.

## Mobile UX

Mobile is an adapted control surface, not a reduced desktop.

- Use bottom navigation.
- Keep worker status pinned.
- Stack media detail as player, actions, jobs, transcript, outputs.
- Keep upload actions reachable with one hand.
- Do not hide critical job or export controls.

## Security and Responsible Use

Responsible-use guardrails:

- Require users to confirm they own, created, licensed, or have permission to process uploaded content.
- Do not bypass DRM.
- Do not scrape private accounts.
- Do not accept login cookies for import.
- Do not bypass paywalls.
- Do not support mass scraping.
- Defer link import until authorized adapters exist.

Security requirements:

- Require Firebase Auth for app routes.
- Enforce per-user Firestore document isolation.
- Enforce per-user Storage path isolation.
- Keep worker service credentials out of the browser.
- Scope worker tokens per user or project.
- Validate file type and size before processing.
- Use authorized download URLs.
- Prefer storing API keys locally in the worker when possible.

Free-tier controls:

- File size limit.
- Job concurrency limit.
- Configurable daily job cap.
- Local worker path for heavy jobs.
- Optional cloud worker, not required.

## Testing Plan

Frontend tests:

- Auth route guards.
- Upload validation.
- Firestore job state rendering.
- Settings provider selection.
- Mobile layout behavior.

Worker tests:

- FFmpeg availability check.
- CPU transcription smoke test.
- CUDA detection fallback.
- Output file generation.
- Failed job writes error state.

Integration tests:

- Upload creates media record.
- Processing creates queued job.
- Worker claims job.
- Worker uploads output.
- UI shows complete output.
- Worker offline state stays readable.
- Missing API key falls back to local provider.
- Unsupported file shows validation error.

## Roadmap

### Phase 1: SaaS Foundation

- Next.js app.
- Firebase Auth.
- Firestore records.
- Firebase Storage uploads.
- Dashboard, upload, library, media detail, settings.

### Phase 2: Worker Foundation

- Python worker.
- Firestore job claiming.
- Storage download/upload.
- FFmpeg conversion.
- Worker status in UI.

### Phase 3: Transcript and Subtitle ML

- faster-whisper transcription.
- SRT/VTT generation.
- Transcript viewer.
- Export TXT/JSON/SRT/VTT.

### Phase 4: Summary and Tags

- Local provider.
- Gemini provider.
- OpenAI provider.
- Provider settings and fallback behavior.

### Phase 5: Search and Organization

- Keyword search.
- Tags/categories.
- Later Qdrant semantic search.

### Phase 6: Advanced Media Intelligence

- Hook analyzer.
- Quality scores.
- Thumbnail ranking.
- Duplicate detection.
- Batch processing.

### Phase 7: Authorized Link Import

- Platform URL detection.
- Metadata preview.
- Manual upload fallback.
- Authorized adapters only.

## Success Criteria

SaveFlow succeeds when a user can:

1. Open the hosted Vercel app.
2. Sign in with Firebase Auth.
3. Upload a media file.
4. See it in the library.
5. Run a local CPU worker on a modest laptop.
6. Convert media with FFmpeg.
7. Generate transcript/subtitle outputs.
8. Generate summary/tags with local, Gemini, or OpenAI provider.
9. Download outputs.
10. Understand worker/setup failures without reading logs.
