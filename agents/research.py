import os
import json
from google import genai
from typing import Dict, Any, List, Optional

class ResearchAgent:
    """
    Research Agent: Extracts deep philosophical concepts, historical quotes,
    and curated book recommendations based on user prompts and requested philosophy.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[ResearchAgent] Gemini client initialization warning: {e}")

    def analyze(self, prompt: str, philosophy: str = "Stoicism", history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Pulls accurate philosophical concepts, quotes, and book recommendations.
        Returns a dictionary with concept details, quotes, and reading list.
        """
        system_instruction = (
            f"You are the MindMentor Research Agent, an expert in philosophy and psychology "
            f"(specializing in {philosophy}). "
            "Your job is to identify core philosophical/psychological concepts, extract 1-2 authentic quotes "
            "from primary authors (e.g., Marcus Aurelius, Carl Jung, Seneca, Lao Tzu, Viktor Frankl), "
            "and suggest 2 highly relevant books. "
            "IMPORTANT: MindMentor is strictly for personal growth and philosophy, NOT medical/psychiatric diagnosis or treatment. "
            "Return valid JSON matching this structure:\n"
            "{\n"
            '  "concept_name": "Name of concept (e.g. Amor Fati, Shadow Integration, Wu Wei)",\n'
            '  "core_insight": "A 2-3 sentence explanation of how this concept applies to the user\'s situation",\n'
            '  "quote": {\n'
            '    "text": "Exact quote text",\n'
            '    "author": "Author Name",\n'
            '    "source": "Book or Work Title"\n'
            '  },\n'
            '  "book_recommendations": [\n'
            '    {\n'
            '      "title": "Book Title",\n'
            '      "author": "Author",\n'
            '      "reason": "Why this book helps with the user\'s inquiry"\n'
            '    }\n'
            '  ]\n'
            "}"
        )

        user_content = f"User Request: '{prompt}'\nChosen Philosophy: {philosophy}"

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=user_content,
                    config={
                        "system_instruction": system_instruction,
                        "response_mime_type": "application/json"
                    }
                )
                if response and response.text:
                    parsed = json.loads(response.text)
                    parsed["agent"] = "research_agent"
                    return parsed
            except Exception as e:
                print(f"[ResearchAgent] Gemini execution error, using structured fallback: {e}")

        # High-quality fallback structured response
        return self._fallback_research(prompt, philosophy)

    def _fallback_research(self, prompt: str, philosophy: str) -> Dict[str, Any]:
        knowledge_base = {
            "Stoicism": {
                "concept_name": "Dichotomy of Control & Amor Fati",
                "core_insight": "Distinguish strictly between what is within your power (your decisions, judgments, and character) and what lies outside it (external outcomes, opinions, and unexpected events). Embrace whatever happens as fuel for moral growth.",
                "quote": {
                    "text": "You have power over your mind - not outside events. Realize this, and you will find strength.",
                    "author": "Marcus Aurelius",
                    "source": "Meditations (Book IV)"
                },
                "book_recommendations": [
                    {"title": "Meditations", "author": "Marcus Aurelius", "reason": "Timeless practical reflections on mental fortitude and sovereignty over one's thoughts."},
                    {"title": "Discourses and Selected Writings", "author": "Epictetus", "reason": "Direct, uncompromising guide on identifying what is truly within your control."}
                ]
            },
            "Jungian": {
                "concept_name": "Shadow Integration & Individuation",
                "core_insight": "Psychological wholeness requires acknowledging and integrating the unexamined, repressed parts of ourselves rather than projecting them onto others or fleeing from them.",
                "quote": {
                    "text": "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
                    "author": "Carl Jung",
                    "source": "Collected Works Vol. 9"
                },
                "book_recommendations": [
                    {"title": "Man and His Symbols", "author": "Carl Jung", "reason": "An accessible entry point into archetypes, dreams, and shadow work."},
                    {"title": "Owning Your Own Shadow", "author": "Robert A. Johnson", "reason": "A practical exploration of discovering the dark and golden sides of the unconscious."}
                ]
            },
            "Existentialism": {
                "concept_name": "Radical Responsibility & Meaning Creation",
                "core_insight": "Existence precedes essence. You are not defined by pre-set conditions, but by the choices you commit to and the personal responsibility you assume in the face of uncertainty.",
                "quote": {
                    "text": "He who has a why to live can bear almost any how.",
                    "author": "Viktor E. Frankl",
                    "source": "Man's Search for Meaning"
                },
                "book_recommendations": [
                    {"title": "Man's Search for Meaning", "author": "Viktor E. Frankl", "reason": "Profound account of logotherapy and finding purpose amidst intense suffering."},
                    {"title": "Existentialism is a Humanism", "author": "Jean-Paul Sartre", "reason": "Clear defense of personal freedom and action as the definition of human worth."}
                ]
            },
            "Taoism": {
                "concept_name": "Wu Wei (Effortless Action)",
                "core_insight": "Align with the natural flow of reality rather than exhausting your vital energy in forced resistance. True effectiveness comes from calm, flexible presence.",
                "quote": {
                    "text": "Do you have the patience to wait until your mud settles and the water is clear?",
                    "author": "Lao Tzu",
                    "source": "Tao Te Ching (Chapter 15)"
                },
                "book_recommendations": [
                    {"title": "Tao Te Ching", "author": "Lao Tzu (trans. Stephen Mitchell)", "reason": "Poetic wisdom on simplicity, non-striving, and natural harmony."},
                    {"title": "The Way of Zen", "author": "Alan Watts", "reason": "Bridging Eastern Taoist thought with modern psychological awareness."}
                ]
            },
            "Buddhism": {
                "concept_name": "Anicca (Impermanence) & Mindful Awareness",
                "core_insight": "Suffering arises when we cling to transient phenomena. Observing thoughts with non-judgmental awareness restores peace and reduces emotional reactivity.",
                "quote": {
                    "text": "Peace comes from within. Do not seek it without.",
                    "author": "Siddhartha Gautama (The Buddha)",
                    "source": "Dhammapada"
                },
                "book_recommendations": [
                    {"title": "The Heart of the Buddha's Teaching", "author": "Thich Nhat Hanh", "reason": "Gentle, practical introduction to mindfulness and transformation."},
                    {"title": "Radical Acceptance", "author": "Tara Brach", "reason": "Combining Buddhist mindfulness with psychological healing."}
                ]
            }
        }

        key = philosophy if philosophy in knowledge_base else "Stoicism"
        res = knowledge_base[key].copy()
        res["agent"] = "research_agent"
        return res

research_agent = ResearchAgent()
