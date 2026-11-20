from typing import List, Dict, Any

class ContentAnalysisAgent:
    """Agent 3: Segments conversations, detects topic shifts, and identifies narrative blocks."""

    def analyze_topics(self, transcript_segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        blocks = []
        current_block = []
        current_duration = 0.0

        for seg in transcript_segments:
            seg_len = seg["end"] - seg["start"]
            current_block.append(seg)
            current_duration += seg_len

            # When window hits 30-60s or terminal sentence ending
            if current_duration >= 30.0:
                blocks.append({
                    "start": current_block[0]["start"],
                    "end": current_block[-1]["end"],
                    "duration": current_block[-1]["end"] - current_block[0]["start"],
                    "text": " ".join([s["text"] for s in current_block]),
                    "segments": list(current_block)
                })
                current_block = []
                current_duration = 0.0

        if current_block and current_duration >= 20.0:
            blocks.append({
                "start": current_block[0]["start"],
                "end": current_block[-1]["end"],
                "duration": current_block[-1]["end"] - current_block[0]["start"],
                "text": " ".join([s["text"] for s in current_block]),
                "segments": list(current_block)
            })

        return blocks
