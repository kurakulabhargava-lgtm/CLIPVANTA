from typing import List, Dict, Any

class HighlightAgent:
    """Agent 4: Evaluates candidate video segments against the strict 100-Point Rubric."""

    def score_candidate(self, block: Dict[str, Any]) -> Dict[str, Any]:
        text = block.get("text", "").lower()
        duration = block.get("duration", 0.0)

        # 1. Opening Hook (20 points max)
        hook_score = 14
        first_sentence = text.split(".")[0] if "." in text else text
        if any(w in first_sentence for w in ["why", "how", "secret", "never", "always", "imagine", "look at", "what if"]):
            hook_score = 19
        elif "?" in first_sentence:
            hook_score = 18

        # 2. Informational Value (20 points max)
        info_score = 15
        if any(w in text for w in ["because", "reason", "data", "result", "system", "technique", "method", "shift"]):
            info_score = 19

        # 3. Emotional Impact (15 points max)
        emotion_score = 11
        if any(w in text for w in ["crazy", "insane", "huge", "amazing", "shocking", "game changer", "breakthrough"]):
            emotion_score = 14

        # 4. Storytelling Flow (15 points max)
        story_score = 12
        if any(w in text for w in ["then", "so", "first", "finally", "when", "suddenly"]):
            story_score = 14

        # 5. Standalone Context (15 points max)
        context_score = 13
        # Penalize pronouns without antecedent at the start
        if text.startswith(("he ", "she ", "it ", "they ")):
            context_score = 9

        # 6. Shareability Potential (15 points max)
        share_score = 12
        if hook_score >= 17 and info_score >= 17:
            share_score = 15

        # Penalty if outside 30-60 second sweet spot
        penalty = 0
        if duration < 25.0 or duration > 65.0:
            penalty = 15

        total_score = max(0, min(100, (hook_score + info_score + emotion_score + story_score + context_score + share_score) - penalty))

        return {
            "total_score": total_score,
            "breakdown": {
                "opening_hook": hook_score,
                "interesting_info": info_score,
                "emotional_impact": emotion_score,
                "storytelling": story_score,
                "standalone_context": context_score,
                "shareability": share_score,
                "duration_penalty": penalty
            }
        }

    def rank_highlights(self, blocks: List[Dict[str, Any]], top_k: int = 3) -> List[Dict[str, Any]]:
        scored = []
        for b in blocks:
            res = self.score_candidate(b)
            scored.append({
                **b,
                "score": res["total_score"],
                "score_breakdown": res["breakdown"]
            })

        # Rank in descending order of score
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]
