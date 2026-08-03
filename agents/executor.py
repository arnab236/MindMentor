import os
import json
from google import genai
from typing import Dict, Any, Optional, List

class ExecutorAgent:
    """
    Executor Agent: Synthesizes findings from Research and Planner agents,
    ensures a grounded, empathetic tone, appends safety disclosures,
    and formats the final output payload.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[ExecutorAgent] Gemini client initialization warning: {e}")

    def execute(
        self,
        prompt: str,
        philosophy: str,
        research_data: Dict[str, Any],
        planner_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Formats final structured response for the user.
        """
        concept_name = research_data.get("concept_name", "Philosophical Inquiry")
        core_insight = research_data.get("core_insight", "")
        quote = research_data.get("quote", {})
        books = research_data.get("book_recommendations", [])
        habits = planner_data.get("daily_habits", [])
        prompt_journal = planner_data.get("reflection_prompt", "")
        mantra = planner_data.get("mindset_mantra", "")

        safety_disclaimer = (
            "MindMentor is designed strictly for personal growth, philosophical self-reflection, "
            "and wisdom exploration. It is NOT a medical or clinical tool. MindMentor does NOT provide "
            "medical diagnosis, psychiatric assessment, or psychological treatment."
        )

        narrative = f"""### {concept_name}

{core_insight}

> **"{quote.get('text', '')}"**
> — *{quote.get('author', 'Philosopher')}*, {quote.get('source', '')}

#### Practical Daily Practice:
"""
        for h in habits:
            narrative += f"- **{h.get('title')}** ({h.get('time_estimate')}): {h.get('description')}\n"

        if mantra:
            narrative += f"\n**Daily Mantra:** *\"{mantra}\"*\n"

        if prompt_journal:
            narrative += f"\n**Journal Prompt for Tonight:** {prompt_journal}\n"

        return {
            "status": "success",
            "philosophy": philosophy,
            "agent_used": "multi_agent_pipeline (Research -> Planner -> Executor)",
            "message": narrative.strip(),
            "concept_name": concept_name,
            "core_insight": core_insight,
            "quote": quote,
            "books": books,
            "habits": habits,
            "reflection_prompt": prompt_journal,
            "mindset_mantra": mantra,
            "safety_disclaimer": safety_disclaimer
        }

executor_agent = ExecutorAgent()
