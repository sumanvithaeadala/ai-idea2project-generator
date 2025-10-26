# fastapi_app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agent.graph import agent
import traceback

app = FastAPI(title="Engineering Project Planner API")

class ProjectPromptRequest(BaseModel):
    user_prompt: str
    recursion_limit: int = 100

class ProjectPromptResponse(BaseModel):
    final_state: dict

@app.post("/generate_project", response_model=ProjectPromptResponse)
def generate_project(request: ProjectPromptRequest):
    try:
        result = agent.invoke(
            {"user_prompt": request.user_prompt},
            {"recursion_limit": request.recursion_limit}
        )
        return {"final_state": result}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
