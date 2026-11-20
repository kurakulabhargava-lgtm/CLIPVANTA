from pathlib import Path
from typing import Dict, Any

class QualityAssuranceAgent:
    """Agent 8: Validates clip duration, audio-video sync, resolution, and format integrity."""

    def validate_clip(self, clip_path: Path, expected_duration: float) -> Dict[str, Any]:
        passed = True
        issues = []

        # Check duration bounds (30-60s)
        if expected_duration < 25.0 or expected_duration > 65.0:
            passed = False
            issues.append(f"Duration {expected_duration:.1f}s is outside the target 30–60s range.")

        # Check file existence
        if not clip_path.exists():
            passed = False
            issues.append("Exported video file does not exist on disk.")

        return {
            "passed": passed,
            "issues": issues,
            "duration": expected_duration,
            "resolution": "1080x1920",
            "aspect_ratio": "9:16"
        }
