import re
from typing import Dict, Any, List, Optional
from agents.research import research_agent
from agents.planner import planner_agent
from agents.executor import executor_agent

class CentralRouter:
    """
    Central Router: Analyzes user prompts and routes execution to the
    appropriate sub-agent or coordinates the full multi-agent workflow.
    """
    def route_and_execute(
        self,
        prompt: str,
        philosophy: str = "Stoicism",
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        p_lower = prompt.lower()

        # Intent classification keywords
        is_reading_request = any(k in p_lower for k in ["book", "read", "quote", "author", "concept", "theory", "source", "who said"])
        is_habit_request = any(k in p_lower for k in ["habit", "routine", "exercise", "action", "step", "schedule", "daily", "journal"])

        if is_reading_request and not is_habit_request:
            # Route directly to Research Agent
            res = research_agent.analyze(prompt, philosophy, history)
            planner_res = planner_agent.synthesize_habits(prompt, philosophy, res)
            return executor_agent.execute(prompt, philosophy, res, planner_res)

        elif is_habit_request and not is_reading_request:
            # Route to Planner with contextual research
            res = research_agent.analyze(prompt, philosophy, history)
            planner_res = planner_agent.synthesize_habits(prompt, philosophy, res)
            return executor_agent.execute(prompt, philosophy, res, planner_res)

        else:
            # Full Multi-Agent Pipeline: Research -> Planner -> Executor
            research_data = research_agent.analyze(prompt, philosophy, history)
            planner_data = planner_agent.synthesize_habits(prompt, philosophy, research_data)
            return executor_agent.execute(prompt, philosophy, research_data, planner_data)

router = CentralRouter()
