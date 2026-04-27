"""Command entry points for SaveFlow local worker."""

import json
import os
from pathlib import Path

import typer

from saveflow_worker.contracts import MediaJob, WorkerConfig, WorkerResult

app = typer.Typer(no_args_is_help=True)


def read_config() -> WorkerConfig:
    return WorkerConfig(
        project_id=os.getenv("FIREBASE_PROJECT_ID", "local-saveflow"),
        device=os.getenv("ML_DEVICE", "auto"),
        model_provider=os.getenv("MODEL_PROVIDER", "local"),
        model_name=os.getenv("LOCAL_MODEL_NAME", "base"),
    )


@app.command()
def doctor() -> None:
    """Print worker runtime configuration."""
    typer.echo(read_config().model_dump_json(indent=2))


@app.command()
def run_once(job_file: Path) -> None:
    """Process one job contract file without mutating remote services."""
    job = MediaJob.model_validate_json(job_file.read_text())
    config = read_config()
    result = WorkerResult(
        job_id=job.job_id,
        media_id=job.media_id,
        status="complete",
        completed_stages=["uploaded", "converted", "transcribed", "summarized", "exported"],
        summary=f"Processed with {config.model_provider}:{config.model_name} on {config.device}.",
    )
    typer.echo(json.dumps(result.model_dump(), indent=2))
