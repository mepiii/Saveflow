# SaveFlow — Full Project Plan

## 1. Project Identity

### Name

**SaveFlow**

### Tagline

**Save media. Convert formats. Understand content with AI.**

### One-line Description

**SaveFlow is an AI-powered media library that lets users import videos, audio, images, and social links, convert them into multiple formats, and generate transcripts, subtitles, summaries, tags, and smart search using machine learning.**

### Portfolio Positioning

This should be presented as:

```text
Full-stack Machine Learning Media Intelligence Platform
```

Not:

```text
Social media downloader
```

Because “downloader” alone sounds simple/risky. “Media intelligence platform” sounds like a real ML product.

---

# 2. Core Idea

Users can paste a link or upload a file.

SaveFlow will:

1. Detect the platform or file type.
2. Import the media when allowed.
3. Convert it into multiple formats.
4. Extract audio/video/image metadata.
5. Run ML processing.
6. Generate transcript, subtitles, summary, tags, category, and embeddings.
7. Save everything into a searchable dashboard.
8. Let users export/download the result.

Important: build it as **permission-based**. For public portfolio, do not frame it as bypassing platform restrictions. YouTube’s terms restrict downloading unless the service allows it, so SaveFlow should clearly say users should only process media they own, have permission to use, or upload manually. ([YouTube][1])

---

# 3. Supported Inputs

## A. Link Input

Supported targets:

| Platform  |    Content Type | MVP Support | Notes                                                                  |
| --------- | --------------: | ----------: | ---------------------------------------------------------------------- |
| YouTube   |           Video |         Yes | Preview/import when permitted                                          |
| YouTube   |          Shorts |         Yes | Treat as short video                                                   |
| Instagram |            Post |         Yes | Authorized/public metadata first                                       |
| Instagram |           Reels |         Yes | Authorized/public metadata first                                       |
| Instagram |         Stories |       Later | Only authorized stories/user-owned media                               |
| TikTok    |           Video |         Yes | Link preview/import where supported                                    |
| TikTok    |      Photo post |       Later | Depends on API/source support                                          |
| TikTok    |           Story |       Later | Only if authorized or uploaded manually                                |
| X/Twitter |            Post |         Yes | Text/media metadata                                                    |
| X/Twitter | Video/Image/GIF |         Yes | Where official access allows                                           |
| X/Twitter |           Story |   No/Future | X does not currently have a main “story” feature like Instagram/TikTok |

Instagram has official story-related Graph API objects for IG users, but this should be treated as authorized creator/business account access, not anonymous scraping. ([Facebook Developers][2]) TikTok’s official developer platform focuses on login, display, posting, research, and sharing/posting APIs, so SaveFlow should keep TikTok story/video import permission-based or rely on manual upload fallback. ([TikTok Developers][3]) X API gives programmatic access to posts/users/media, and X media objects can include photos, videos, animated GIFs, and playback variants. ([X Developer Platform][4])

## B. File Upload

This is the safest and most reliable MVP path.

Supported uploads:

| Type     | Formats                       |
| -------- | ----------------------------- |
| Video    | MP4, MOV, MKV, WEBM, AVI      |
| Audio    | MP3, WAV, M4A, AAC, FLAC, OGG |
| Image    | JPG, PNG, WEBP                |
| Subtitle | SRT, VTT                      |
| Metadata | JSON, CSV                     |

---

# 4. Supported Export / Download Formats

This is where SaveFlow becomes useful.

## Video Exports

Users can export imported/uploaded media as:

```text
MP4
WEBM
MOV
MKV
GIF
```

Options:

```text
Original quality
1080p
720p
480p
360p
Compressed MP4
Muted MP4
Clip-only MP4
Subtitle-burned MP4
```

## Audio Exports

Users can convert video/audio into:

```text
MP3
WAV
M4A
AAC
FLAC
OGG
```

Options:

```text
High quality MP3 320kbps
Medium quality MP3 192kbps
Small file MP3 128kbps
Voice-only WAV
Normalized audio
Noise-reduced audio
```

## Subtitle / Transcript Exports

```text
SRT
VTT
TXT
JSON
CSV
DOCX later
PDF later
```

## Image / Thumbnail Exports

```text
JPG
PNG
WEBP
GIF thumbnail
Contact sheet
Keyframe ZIP
```

FFmpeg is a strong fit here because it is a universal media converter that can read many input types and transcode them into many output formats. ([FFmpeg][5])

---

# 5. Main Product Features

## Feature 1 — Universal Import Box

User pastes:

```text
YouTube link
TikTok link
Instagram link
X/Twitter link
```

or uploads:

```text
MP4 / MP3 / image / subtitle file
```

SaveFlow detects:

```json
{
  "source": "youtube",
  "content_type": "short",
  "media_type": "video",
  "supported": true
}
```

---

## Feature 2 — Format Converter

This is a core feature.

Example conversions:

```text
MP4 video → MP3 audio
MP4 video → WAV audio
MP4 video → GIF
MP4 video → compressed MP4
MOV video → MP4
WEBM video → MP4
MP3 audio → WAV
WAV audio → MP3
Video + SRT → MP4 with burned subtitles
Video → audio-only file
Video → thumbnail images
```

User options:

```text
Choose output format
Choose resolution
Choose bitrate
Choose audio quality
Choose start/end trim
Choose subtitle burn-in
Choose export as single file or ZIP
```

---

## Feature 3 — AI Transcript Generator

SaveFlow extracts audio and generates a transcript.

Outputs:

```text
Full transcript
Timestamped transcript
Speaker-separated transcript later
Language detection
Translation later
```

Recommended model:

```text
faster-whisper
```

faster-whisper is a CTranslate2-based reimplementation of Whisper designed for faster and more memory-efficient transcription, which is useful for a portfolio app running on CPU or limited hardware. ([GitHub][6]) Whisper itself is a general-purpose speech recognition model that supports multilingual speech recognition, translation, and language identification. ([GitHub][7])

---

## Feature 4 — AI Subtitle Generator

Generate subtitles from any video/audio.

Subtitle features:

```text
Auto-generate SRT
Auto-generate VTT
Edit subtitle text
Edit start/end timestamps
Merge subtitle segments
Split subtitle segments
Preview subtitles on video
Burn subtitles into video
Export subtitle separately
```

This makes SaveFlow useful even without social media links.

---

## Feature 5 — AI Summary

For every video/audio/post, generate:

```text
Short summary
Detailed summary
Key points
Action items
Main topic
Suggested title
Suggested description
```

Example:

```json
{
  "summary": "This video explains how to build an ML portfolio project using media processing and AI features.",
  "key_points": [
    "Use media upload as the reliable MVP",
    "Add transcription and semantic search",
    "Frame the app as an AI media library"
  ],
  "suggested_title": "How to Build a Strong ML Portfolio Project"
}
```

---

## Feature 6 — AI Tagging

Generate tags from:

```text
Transcript
Caption
Title
Thumbnail
Visual content
Audio features
```

Example:

```json
{
  "tags": ["machine learning", "portfolio", "full-stack", "creator tools", "video editing"]
}
```

---

## Feature 7 — Content Classification

Automatically classify content into:

```text
Education
Coding
Music
Podcast
Gaming
News
Entertainment
Finance
Lifestyle
Meme
Tutorial
Review
Productivity
Research
```

This can use:

```text
Text classification from transcript
Image classification from thumbnail
Embedding similarity
Zero-shot classification
```

---

## Feature 8 — Semantic Search

This is one of the best ML features for your portfolio.

Normal search:

```text
Find exact title: "AI portfolio"
```

Semantic search:

```text
Find videos about building machine learning projects
```

Even if the title does not say “machine learning,” SaveFlow can find it from the transcript/summary/tags.

Recommended stack:

```text
PostgreSQL + pgvector
```

pgvector supports vector similarity search directly inside PostgreSQL, including exact/approximate nearest neighbor search and cosine-style vector comparisons. ([GitHub][8])

---

## Feature 9 — AI Hook Analyzer

For Shorts/Reels/TikToks, analyze the first few seconds.

Score:

```text
Hook strength
Clarity
Speech energy
Visual movement
Face presence
Subtitle readability
Opening sentence quality
```

Example:

```json
{
  "hook_score": 84,
  "reason": "The video starts with a clear question and shows the main subject immediately.",
  "suggestions": [
    "Add larger subtitles in the first 3 seconds",
    "Cut silence before the first spoken word"
  ]
}
```

---

## Feature 10 — Content Quality Score

Give each media item a quality score.

Score based on:

```text
Audio clarity
Video resolution
Subtitle readability
Transcript confidence
Hook quality
Topic clarity
Length suitability
Visual stability
```

Example:

```json
{
  "content_score": 78,
  "audio_score": 71,
  "subtitle_score": 86,
  "visual_score": 75
}
```

---

## Feature 11 — Audio Quality Analyzer

Analyze:

```text
Background noise
Volume level
Silence gaps
Clipping
Speech clarity
Music dominance
```

Suggested fixes:

```text
Normalize volume
Remove silence
Apply noise reduction
Boost voice frequencies
Export voice-only MP3
```

---

## Feature 12 — Smart Thumbnail / Keyframe Picker

For videos, extract frames and rank them.

Detect:

```text
Clear face
Strong contrast
Readable text
Low blur
Good composition
Interesting moment
```

Exports:

```text
Best thumbnail JPG
Top 5 keyframes
Contact sheet
Thumbnail ZIP
```

---

## Feature 13 — Duplicate Detection

Detect duplicate or near-duplicate media.

Methods:

```text
URL hash
File hash
Perceptual image hash
Audio fingerprint
Embedding similarity
```

Example:

```text
This video looks 94% similar to a file already saved in your library.
```

---

## Feature 14 — Auto Folder Organization

SaveFlow automatically organizes media into smart folders:

```text
Coding
Study
Music
Research
Inspiration
TikTok Ideas
YouTube References
Memes
Tutorials
Business
```

Based on ML tags and classification.

---

## Feature 15 — Batch Processing

Users can import or upload multiple files.

Batch actions:

```text
Convert all to MP3
Convert all to MP4
Generate transcripts for all
Generate subtitles for all
Generate summaries for all
Export all as ZIP
```

This makes the app feel professional.

---

# 6. Final Feature Set

## MVP Features

Build these first:

```text
1. Landing page
2. Dashboard
3. Upload MP4/MP3/image
4. Paste link with platform detection
5. Media preview
6. Convert video to MP3
7. Convert video/audio to multiple formats
8. Generate transcript
9. Generate SRT/VTT subtitles
10. Generate summary
11. Generate tags/category
12. Save to library
13. Search media
14. Export files
```

## Strong ML Features

Add after MVP:

```text
1. Semantic search
2. Hook analyzer
3. Content quality score
4. Audio quality score
5. Smart thumbnail picker
6. Duplicate detection
7. Auto-folder organization
8. Hashtag generator
9. Safety classifier
```

## Advanced Features

Later:

```text
1. Speaker diarization
2. Auto translation
3. Team collaboration
4. Cloud storage
5. User accounts
6. Browser extension
7. Mobile version
8. API for developers
```

---

# 7. Recommended Tech Stack

## Frontend

```text
Next.js
TypeScript
TailwindCSS
shadcn/ui
Framer Motion
React Query
Zustand
```

Why:

```text
Modern UI
Good portfolio impression
Easy dashboard building
Good animation support
Clean component structure
```

## Backend

```text
FastAPI
Python
Pydantic
Uvicorn
SQLAlchemy
Celery or RQ
Redis
```

Why:

```text
Best fit for ML-heavy backend
Easy API docs
Easy Python ML integration
Good background job support
```

## Media Processing

```text
FFmpeg
FFprobe
OpenCV
MoviePy optional
```

## Machine Learning

```text
faster-whisper
sentence-transformers
scikit-learn
PyTorch
CLIP or image embedding model
OpenCV
```

## Database

MVP:

```text
SQLite
```

Better portfolio version:

```text
PostgreSQL + pgvector
```

## Storage

MVP:

```text
Local uploads/
Local outputs/
```

Production-style:

```text
Cloudflare R2
AWS S3
Supabase Storage
```

---

# 8. System Architecture

```text
User
  ↓
Next.js Frontend
  ↓
FastAPI Backend
  ↓
Import Service / Upload Service
  ↓
Media Storage
  ↓
Job Queue
  ↓
Worker Pipeline
  ↓
FFmpeg Processing
  ↓
ML Processing
  ↓
PostgreSQL + pgvector
  ↓
Dashboard / Library / Export
```

---

# 9. Backend Services

```text
backend/
  app/
    main.py

    api/
      routes_import.py
      routes_upload.py
      routes_media.py
      routes_convert.py
      routes_transcript.py
      routes_subtitle.py
      routes_summary.py
      routes_search.py
      routes_export.py

    services/
      platform_detector.py
      media_import_service.py
      upload_service.py
      ffmpeg_service.py
      conversion_service.py
      transcription_service.py
      subtitle_service.py
      summary_service.py
      tagging_service.py
      classification_service.py
      embedding_service.py
      semantic_search_service.py
      thumbnail_service.py
      audio_quality_service.py
      duplicate_detection_service.py
      safety_service.py
      storage_service.py

    workers/
      tasks.py
      queue.py

    models/
      user.py
      media.py
      transcript.py
      subtitle.py
      ml_result.py
      export.py
      job.py

    core/
      config.py
      database.py
      security.py
      settings.py
```

---

# 10. Frontend Pages

```text
frontend/
  app/
    page.tsx
    dashboard/
    import/
    upload/
    library/
    media/[id]/
    convert/
    search/
    settings/
```

## Page 1 — Landing Page

Sections:

```text
Hero
Supported platforms
Format conversion features
ML features
Workflow preview
Demo screenshots
CTA
```

Hero text:

```text
SaveFlow turns media into searchable, convertible, AI-ready content.
```

## Page 2 — Import Page

Features:

```text
Paste link
Auto-detect platform
Show preview
Choose import options
Choose output format
Start processing
```

## Page 3 — Upload Page

Features:

```text
Drag and drop
Multiple file upload
File validation
Choose processing options
Batch convert
```

## Page 4 — Dashboard

Show:

```text
Total media
Total transcripts
Total converted files
Processing jobs
Storage usage
Most used categories
Recent imports
```

## Page 5 — Library Page

Features:

```text
Grid/list view
Filter by platform
Filter by file type
Filter by category
Sort by date
Search by keyword
Semantic search
```

## Page 6 — Media Detail Page

Show:

```text
Media preview
Format info
Download/export buttons
Transcript
Subtitles
Summary
Tags
Category
Scores
Keyframes
Related media
```

## Page 7 — Converter Page

Features:

```text
Input file
Output format selector
Resolution selector
Bitrate selector
Trim controls
Subtitle burn-in option
Export button
```

---

# 11. API Endpoint Plan

## Import

```text
POST /api/import/link
POST /api/import/preview
GET  /api/import/status/{job_id}
```

## Upload

```text
POST /api/upload
POST /api/upload/batch
```

## Media

```text
GET    /api/media
GET    /api/media/{id}
PATCH  /api/media/{id}
DELETE /api/media/{id}
```

## Conversion

```text
POST /api/convert/{media_id}
GET  /api/convert/status/{job_id}
```

Example request:

```json
{
  "output_format": "mp3",
  "audio_bitrate": "320k",
  "trim_start": "00:00:05",
  "trim_end": "00:01:20",
  "normalize_audio": true
}
```

## ML

```text
POST /api/ml/transcribe/{media_id}
POST /api/ml/subtitle/{media_id}
POST /api/ml/summarize/{media_id}
POST /api/ml/tag/{media_id}
POST /api/ml/classify/{media_id}
POST /api/ml/analyze-audio/{media_id}
POST /api/ml/analyze-hook/{media_id}
POST /api/ml/generate-thumbnail/{media_id}
POST /api/ml/embed/{media_id}
```

## Search

```text
GET  /api/search?q=
POST /api/search/semantic
```

## Export

```text
GET /api/export/{media_id}/mp3
GET /api/export/{media_id}/mp4
GET /api/export/{media_id}/wav
GET /api/export/{media_id}/srt
GET /api/export/{media_id}/vtt
GET /api/export/{media_id}/txt
GET /api/export/{media_id}/json
GET /api/export/{media_id}/zip
```

---

# 12. Database Schema

## users

```sql
id
name
email
password_hash
created_at
updated_at
```

## media_items

```sql
id
user_id
source_type
source_platform
source_url
original_filename
title
description
media_type
content_type
mime_type
duration_seconds
width
height
file_size
thumbnail_path
original_path
status
created_at
updated_at
```

## media_exports

```sql
id
media_id
export_format
export_type
quality
bitrate
resolution
file_path
file_size
created_at
```

## transcripts

```sql
id
media_id
language
full_text
segments_json
confidence_score
created_at
```

## subtitles

```sql
id
media_id
format
language
subtitle_path
segments_json
created_at
```

## ml_results

```sql
id
media_id
summary
key_points_json
tags_json
category
hook_score
content_score
audio_score
visual_score
safety_score
created_at
```

## embeddings

```sql
id
media_id
embedding_type
embedding_vector
source_text
created_at
```

## jobs

```sql
id
media_id
job_type
status
progress
error_message
created_at
updated_at
```

---

# 13. ML Pipeline

## Pipeline for Video

```text
1. Receive video
2. Validate file
3. Extract metadata with FFprobe
4. Extract audio with FFmpeg
5. Generate transcript with faster-whisper
6. Generate subtitle segments
7. Generate summary
8. Generate tags
9. Classify category
10. Extract keyframes with OpenCV
11. Score thumbnail candidates
12. Analyze audio quality
13. Generate embeddings
14. Store results
15. Enable semantic search
```

## Pipeline for Audio

```text
1. Receive audio
2. Validate file
3. Normalize/convert audio
4. Generate transcript
5. Generate subtitles if needed
6. Generate summary
7. Generate tags
8. Generate embeddings
9. Store and export
```

## Pipeline for Image

```text
1. Receive image
2. Validate file
3. Generate image metadata
4. Generate visual tags
5. Classify category
6. Generate embedding
7. Store and search
```

## Pipeline for Text/Post

```text
1. Receive post text/caption
2. Clean text
3. Generate summary
4. Generate tags
5. Classify category
6. Generate embedding
7. Store in library
```

---

# 14. Conversion Feature Details

## Video to Audio

```text
MP4 → MP3
MP4 → WAV
MP4 → M4A
MP4 → AAC
MP4 → FLAC
```

Options:

```text
Bitrate: 128k, 192k, 256k, 320k
Normalize volume: true/false
Remove silence: true/false
Noise reduction: true/false
Trim start/end
```

## Video to Video

```text
MOV → MP4
MKV → MP4
WEBM → MP4
MP4 → WEBM
MP4 → compressed MP4
MP4 → subtitle-burned MP4
```

Options:

```text
Resolution: original, 1080p, 720p, 480p, 360p
FPS: original, 30, 24
Compression: low, medium, high
Subtitles: none, soft subtitle, burned subtitle
```

## Video to Image

```text
Video → thumbnail JPG
Video → keyframe PNG
Video → GIF
Video → contact sheet
```

## Transcript/Subtitle Export

```text
Transcript → TXT
Transcript → JSON
Subtitle → SRT
Subtitle → VTT
Segments → CSV
```

---

# 15. Responsible Use Guardrails

Add these to the app:

```text
Only process content you own, created, licensed, or have permission to use.
Some platforms restrict downloading or automated access.
When direct import is unavailable, upload your own file instead.
SaveFlow does not bypass DRM, private accounts, paywalls, login walls, or platform protections.
```

Technical guardrails:

```text
No private account scraping
No DRM bypass
No paywalled media bypass
No login-cookie import from users
No mass scraping mode
Rate limiting
File size limits
User-owned media confirmation checkbox
```

This keeps the project safer and more professional.

---

# 16. Development Roadmap

## Phase 1 — MVP Foundation

Build:

```text
Next.js frontend
FastAPI backend
Upload MP4/MP3/image
Local storage
Media library
Media detail page
Basic FFmpeg conversion
Download converted files
```

Goal:

```text
User uploads MP4 → converts to MP3 → downloads MP3.
```

## Phase 2 — Transcript + Subtitle ML

Build:

```text
Audio extraction
faster-whisper transcription
SRT generation
VTT generation
Transcript viewer
Subtitle editor
Export TXT/SRT/VTT/JSON
```

Goal:

```text
User uploads video → gets transcript + subtitles + MP3 export.
```

## Phase 3 — AI Summary + Tags

Build:

```text
Summary generation
Key points
Tags
Category classification
Hashtag suggestions
```

Goal:

```text
Each media item becomes searchable and organized.
```

## Phase 4 — Semantic Search

Build:

```text
Embedding generation
PostgreSQL + pgvector
Semantic search UI
Related media suggestions
```

Goal:

```text
User searches by meaning, not exact title.
```

## Phase 5 — Advanced ML Scoring

Build:

```text
Hook analyzer
Audio quality score
Content quality score
Smart thumbnail picker
Duplicate detection
Safety classifier
```

Goal:

```text
SaveFlow feels like an AI assistant for creators.
```

## Phase 6 — Link Import

Build:

```text
Platform URL detector
Metadata preview
Authorized import system
Manual upload fallback
Source-specific adapters
```

Goal:

```text
User can paste links where supported, but app remains safe and stable.
```

## Phase 7 — Polish Portfolio

Add:

```text
Beautiful landing page
README
Architecture diagram
Demo video
Screenshots
API docs
Model pipeline explanation
Responsible AI section
Deployment guide
```

---

# 17. Best MVP Scope

Do not start with every social platform first.

Best order:

```text
1. Upload local MP4/MP3/image
2. Convert MP4 to MP3/MP4/WAV/SRT/VTT
3. Generate transcript/subtitle/summary/tags
4. Build searchable library
5. Add semantic search
6. Add platform link preview/import later
```

This gives you a working ML portfolio project faster.

---

# 18. README Structure

```text
# SaveFlow

AI-powered media saver, converter, and content intelligence platform.

## Features
- Upload videos, audio, and images
- Convert media into MP3, MP4, WAV, M4A, SRT, VTT, JSON, ZIP
- Generate transcripts with ML
- Generate subtitles
- Summarize media
- Generate tags and categories
- Semantic search
- Audio quality analysis
- Hook analysis
- Smart thumbnail extraction

## Tech Stack
Frontend, backend, ML, database, storage

## Architecture
Diagram

## ML Pipeline
Transcription, embeddings, classification, scoring

## API Endpoints
Import, upload, convert, ML, search, export

## Responsible Use
Permission-based media processing only

## Setup
Backend setup
Frontend setup
FFmpeg install
Database setup

## Screenshots
Dashboard
Import page
Library
Media detail
Subtitle editor

## Roadmap
MVP, ML, platform adapters, deployment
```

---

# 19. Final Prompt to Give Another AI

Copy this draft:

```text
Build a complete project specification for a full-stack machine learning web app called SaveFlow.

SaveFlow is an AI-powered media saver, converter, and content intelligence platform. Users can upload media files or paste supported social media links. The app should import media only when permission-based or technically allowed, then convert the media into multiple formats such as MP3, MP4, WAV, M4A, WEBM, GIF, SRT, VTT, TXT, JSON, CSV, and ZIP.

Core idea:
SaveFlow should not be framed as a piracy or scraping tool. It should be a creator-focused AI media library that supports user-owned media, authorized imports, and manual upload fallback.

Supported inputs:
- Local video: MP4, MOV, MKV, WEBM, AVI
- Local audio: MP3, WAV, M4A, AAC, FLAC, OGG
- Local images: JPG, PNG, WEBP
- Links: YouTube videos/Shorts, Instagram posts/Reels/authorized Stories, TikTok videos/posts/authorized Stories, X/Twitter posts/videos/media where official access allows

Core features:
1. Universal import box
2. File upload
3. Platform detection
4. Media preview
5. Format conversion
6. Video to MP3/audio conversion
7. Video to video conversion
8. Audio conversion
9. Thumbnail/keyframe extraction
10. Transcript generation
11. Subtitle generation
12. Subtitle editor
13. Summary generation
14. Tag generation
15. Category classification
16. Semantic search
17. Hook analyzer
18. Content quality score
19. Audio quality analyzer
20. Duplicate detection
21. Smart folder organization
22. Export/download in multiple formats

Preferred stack:
Frontend: Next.js, TypeScript, TailwindCSS, shadcn/ui, Framer Motion
Backend: FastAPI, Python, Pydantic, SQLAlchemy, Uvicorn
Queue: Redis + Celery or RQ
Media: FFmpeg, FFprobe, OpenCV
ML: faster-whisper, sentence-transformers, scikit-learn, PyTorch, CLIP or image embedding model
Database: PostgreSQL + pgvector for production-style version, SQLite for MVP
Storage: local storage first with clean abstraction for S3/R2 later

Please refine this into:
1. Product requirements document
2. MVP scope
3. Advanced feature roadmap
4. Full database schema
5. API endpoint design
6. Frontend page/component structure
7. Backend folder structure
8. ML pipeline design
9. Format conversion system
10. Responsible-use guardrails
11. Testing plan
12. Deployment plan
13. README structure
14. Portfolio presentation strategy
15. Step-by-step development checklist
```


