from langchain_google_genai.chat_models import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

load_dotenv()


llm = ChatGoogleGenerativeAI(model="models/gemini-2.5-pro", google_api_key=os.getenv("GEMINI_API_KEY"))
response = llm.invoke("Hello, how are you?")
print(response.content)
