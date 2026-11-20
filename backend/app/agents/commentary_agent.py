from typing import Dict, Any

class CommentaryAgent:
    """Agent 5: Generates engaging 3-part commentary (Hook, Context, Outro)."""

    def generate_commentary(self, clip_title: str, clip_text: str) -> Dict[str, str]:
        # Clean extracted themes
        summary = clip_text[:120].strip()
        
        hook = f"You won't believe how this changes everything."
        explanation = f"Notice how this directly solves the single biggest bottleneck creators face every day."
        outro = "Drop a comment if you would use this in your workflow!"

        return {
            "hook": hook,
            "explanation": explanation,
            "outro": outro,
            "full_script": f"{hook} {explanation} {outro}"
        }
