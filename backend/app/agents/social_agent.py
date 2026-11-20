from typing import Dict, Any

class SocialMediaAgent:
    """Agent 9: Generates platform-specific viral titles, captions, and tags."""

    def generate_social_package(self, clip_title: str, clip_text: str) -> Dict[str, Any]:
        hook = clip_text[:60].replace('"', '')

        return {
            "youtube_shorts": {
                "title": f"{clip_title} #shorts",
                "description": f"{hook}...\n\nWatch full episode for more insights.\n\n#shorts #ai #technology #productivity",
                "tags": ["shorts", "ai", "tech", "viral", "breakthrough"]
            },
            "instagram_reels": {
                "caption": f"Mind blown 🤯\n\n{hook}\n.\n.\n#reels #viralvideos #techtrends #aiproductivity #creator",
                "hashtags": ["#reels", "#fyp", "#trending", "#innovation"]
            },
            "tiktok": {
                "caption": f"Wait till you see this part 😳 {hook} #fyp #viral #aitools",
                "tags": ["fyp", "viral", "foryou", "techhacks"]
            }
        }
