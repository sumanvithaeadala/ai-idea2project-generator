# AI Idea2Project Generator

Live App: https://ai-idea2project-generator.vercel.app


## 📌 Overview
This project is an AI-powered **Idea to Project Generator** that converts any user idea into a complete, ready-to-download project structure. It uses **LangGraph**,**Groq**, **OpenAI OSS GPT-120B LLM model**, **FastAPI**, and a modern **Next.js** frontend with full authentication and per-user secure storage.
 
The flow works as follows:
1. **Planner Agent** – analyzes the user idea and creates a high-level technical plan.  
2. **Architect Agent** – converts the plan into a detailed folder structure, modules, and system design.  
3. **Coder Agent** – generates complete source code files, configs, and supporting scripts.  
4. **File Writer** – organizes all generated files into a project directory.  
5. **Packager** – bundles the project into a ZIP file and prepares it for download.

The LLM-orchestrated backend workflow generates project files dynamically and stores them in **Supabase Storage**, with **1-year caching** for performance and cost optimization. User authentication is powered by **Supabase Auth** (email/password and Google OAuth). The frontend provides a clean interface for idea submission, viewing generation history, and downloading generated files.

---


## ⭐ Features

### **AI-Powered Full Project Generator**
- Converts any idea into a complete, structured project using **LangGraph** + **OpenAI OSS GPT-120B**.
- Multi-step workflow generates architecture, folder structure, and code files.
- Final output is packaged as a ZIP and delivered to the user.

### **Backend (FastAPI + uv)**
- FastAPI backend hosted on Render.
- Uses `uv` as the Python package/environment manager.
- 1-year caching for generated ZIP files in Supabase Storage to improve performance.

### **Secure Authentication & User Management**
- Authentication via **Supabase Auth** (Email/Password + Google OAuth).
- Fully secure session handling.
- Every user gets isolated storage space for privacy and security.

### **User Project History & Storage**
- Each generated project is saved in **Supabase Storage** under the user’s unique folder.
- Users can revisit, re-download, or regenerate past projects.
- Strong file isolation to ensure confidentiality.

### **Frontend (Next.js + Tailwind CSS)**
- Built with **Next.js App Router** and styled using **Tailwind CSS**.
- Dashboard shows user history, generated projects, and download options.
- Smooth, responsive UI with secure API calls to backend.

### **Cloud Deployment**
- **Frontend →** Vercel  
- **Backend →** Render (FastAPI)  
- **Auth & Storage →** Supabase  
- Fully serverless, scalable, and production-ready.






## ▶️ How to Run Locally

##  Backend Setup (FastAPI)


### 1. Install dependencies using uv
```bash
uv sync
```

### 2. Create environment variables (`.env`)
```
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
OPENAI_API_KEY=...
STORAGE_BUCKET_NAME=...
```

### 3. Run the backend
```bash
uvicorn app.main:app --reload
```
The API runs at: http://localhost:8000

---

##  Frontend Setup (Next.js)

### 1. Go to frontend-ui folder
```bash
cd frontend-ui/frontend-ui
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
BACKEND_API_URL=http://localhost:8000
```

### 4. Run frontend
```bash
npm run dev
```

App runs at: http://localhost:3000

---

