# fastapi_app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agent.graph import agent
import traceback
from supabase_py import SupabaseStorageClass
from util_functions import convert_string_to_md5
from fastapi.middleware.cors import CORSMiddleware
from agent.tools import init_project_root

app = FastAPI(title="Engineering Project Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectPromptRequest(BaseModel):
    user_prompt: str
    recursion_limit: int = 100
    user_uuid: str


class ProjectPromptResponse(BaseModel):
    final_state: dict
    signed_url: str = None


@app.post("/generate_project", response_model=ProjectPromptResponse)
def generate_project(request: ProjectPromptRequest):
    try:
        init_project_root()
        request_hash = convert_string_to_md5(request.user_prompt)
        storage = SupabaseStorageClass()
        signed_url = storage.get_signed_url_cache(request_hash, request.user_uuid)
        if len(signed_url) > 0:
            return {"final_state": {}, "signed_url": signed_url}
        result = agent.invoke(
            {"user_prompt": request.user_prompt},
            {"recursion_limit": request.recursion_limit}
        )
        new_signed_url = storage.upload_project_zip_and_get_signedurl(request.user_uuid,request_hash,request.user_prompt, "./generated_project")
        return {"final_state": result, "signed_url": new_signed_url}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/projects")
def get_user_projects(user_uuid: str):
    try:
        supabase = SupabaseStorageClass()
        response = supabase.get_user_history_details(user_uuid)
        projects = response
        print("Fetched projects:", projects)
        if not projects:
            return {"data": []}
        return {"data": projects}
    except Exception as e:
        print("Error fetching projects:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch user projects")