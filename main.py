import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from router import router

app = FastAPI(
    title="MindMentor AI Multi-Agent Microservice",
    description="Python AI Service directing user prompts through Research, Planner, and Executor agents.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str = Field(..., example="I feel overwhelmed by workplace expectations and constant change.")
    philosophy: Optional[str] = Field("Stoicism", example="Stoicism")
    history: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MindMentor Python Multi-Agent Microservice",
        "agents_active": ["research_agent", "planner_agent", "executor_agent"],
        "safety_guardrails": "Active (Personal growth & philosophy only, no psychiatric diagnosis)"
    }

@app.post("/process")
def process_prompt(request: ChatRequest):
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        result = router.route_and_execute(
            prompt=request.prompt,
            philosophy=request.philosophy or "Stoicism",
            history=request.history or []
        )
        return result
    except Exception as e:
        print(f"[MainPy Error] Failed to process prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PYTHON_PORT", "8000"))
    print(f"Starting MindMentor Python Microservice on port {port}...")
    uvicorn.run(app, host="127.0.0.1", port=port)
