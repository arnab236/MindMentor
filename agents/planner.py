import os
import json
from google import genai
from typing import Dict, Any, List, Optional

class PlannerAgent:
    """
    Planner Agent: Synthesizes user conversations and philosophical principles
    into actionable, step-by-step daily habits, routines, and journaling prompts.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[PlannerAgent] Gemini client initialization warning: {e}")

    def synthesize_habits(self, prompt: str, philosophy: str = "Stoicism", research_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Translates philosophical concepts into concrete daily action items.
        Returns a structured dictionary of daily habits and journaling prompts.
        """
        concept_context = ""
        if research_data and "concept_name" in research_data:
            concept_context = f"Philosophical Concept: {research_data['concept_name']}\nCore Insight: {research_data.get('core_insight', '')}"

        system_instruction = (
            "You are the MindMentor Planner Agent, specializing in habit design, behavioral psychology, "
            "and practical wisdom routines. "
            "Your job is to convert abstract philosophical guidance into 3 concrete, micro-habits and 1 daily reflection journal prompt. "
            "IMPORTANT: MindMentor is strictly for personal growth and self-improvement, NOT medical/psychiatric diagnosis or treatment. "
            "Return valid JSON matching this structure:\n"
            "{\n"
            '  "daily_habits": [\n'
            '    {\n'
            '      "id": "h1",\n'
            '      "title": "Actionable Habit Name",\n'
            '      "description": "Specific 1-2 sentence instruction on when and how to perform it",\n'
            '      "time_estimate": "5 mins",\n'
            '      "category": "Mindset / Reflection / Action / Somatic"\n'
            '    }\n'
            '  ],\n'
            '  "reflection_prompt": "A deep journal reflection prompt for evening review",\n'
            '  "mindset_mantra": "A 1-line grounding affirmation rooted in the philosophy"\n'
            "}"
        )

        user_content = f"User Inquiry: '{prompt}'\nPhilosophy: {philosophy}\n{concept_context}"

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
                    parsed["agent"] = "planner_agent"
                    return parsed
            except Exception as e:
                print(f"[PlannerAgent] Gemini execution error, using fallback: {e}")

        return self._fallback_planner(prompt, philosophy)

    def _fallback_planner(self, prompt: str, philosophy: str) -> Dict[str, Any]:
        routines = {
            "Stoicism": {
                "daily_habits": [
                    {
                        "id": "h1",
                        "title": "Morning Control Audit (Premeditatio Malorum)",
                        "description": "Spend 3 minutes listing today's anticipated obstacles. Divide them into 'Within my control' (my focus & response) vs 'Outside my control' (traffic, weather, opinions).",
                        "time_estimate": "3 mins",
                        "category": "Mindset"
                    },
                    {
                        "id": "h2",
                        "title": "Pause Before Responding",
                        "description": "When faced with an irritating event or impulse, take 3 slow breaths before reacting. Remind yourself: 'This is an impression, not an imperative.'",
                        "time_estimate": "1 min",
                        "category": "Action"
                    },
                    {
                        "id": "h3",
                        "title": "Evening Moral Audit",
                        "description": "Review your day in a journal: What did I do well? Where did I falter? How can I act with greater virtue tomorrow?",
                        "time_estimate": "5 mins",
                        "category": "Reflection"
                    }
                ],
                "reflection_prompt": "If today was my final day to show character and kindness, did I waste energy on things outside my power?",
                "mindset_mantra": "I control my judgments, choices, and attitude; external events have no power over my character."
            },
            "Jungian": {
                "daily_habits": [
                    {
                        "id": "h1",
                        "title": "Shadow Trigger Tracking",
                        "description": "Note moments today when someone's behavior strongly irritated or fascinated you. Ask: 'What disowned part of myself might this reflect?'",
                        "time_estimate": "4 mins",
                        "category": "Reflection"
                    },
                    {
                        "id": "h2",
                        "title": "Active Imagination Micro-Session",
                        "description": "Sit quietly for 5 minutes and allow an uncomfortable feeling or recurring thought image to speak without judging or censoring it.",
                        "time_estimate": "5 mins",
                        "category": "Mindset"
                    },
                    {
                        "id": "h3",
                        "title": "Dream & Symbol Journaling",
                        "description": "Upon waking, jot down any key symbols, feelings, or narrative fragments from your dreams before checking screens.",
                        "time_estimate": "5 mins",
                        "category": "Somatic"
                    }
                ],
                "reflection_prompt": "What part of myself have I been hiding or denying to gain approval, and how can I honor it constructively?",
                "mindset_mantra": "I am not what happened to me, I am what I choose to become through self-awareness."
            }
        }

        key = philosophy if philosophy in routines else "Stoicism"
        res = routines[key].copy()
        res["agent"] = "planner_agent"
        return res

planner_agent = PlannerAgent()
