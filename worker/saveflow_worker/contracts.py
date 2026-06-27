"""Worker job contract shared by CLI and future queue adapters."""

from typing import Literal

from pydantic import BaseModel, Field

MediaStage = Literal["uploaded", "converted", "transcribed", "summarized", "exported"]
WorkerStatus = Literal["queued", "processing", "complete", "failed"]
ModelProvider = Literal["local", "gemini", "openai"]
DeviceMode = Literal["auto", "cpu", "cuda"]


class WorkerConfig(BaseModel):
    project_id: str = Field(default="local-saveflow")
    device: DeviceMode = Field(default="auto")
    model_provider: ModelProvider = Field(default="local")
    model_name: str = Field(default="base")


class MediaJob(BaseModel):
    user_id: str
    media_id: str
    job_id: str
    storage_path: str
    mime_type: str
    stages: list[MediaStage] = Field(default_factory=lambda: ["uploaded"])


class WorkerResult(BaseModel):
    job_id: str
    media_id: str
    status: WorkerStatus
    completed_stages: list[MediaStage]
    summary: str | None = None
    transcript_path: str | None = None
    error: str | None = None
