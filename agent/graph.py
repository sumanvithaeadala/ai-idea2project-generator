from dotenv import load_dotenv
# from langchain_debug import set_debug, set_verbose
from langchain_groq.chat_models import ChatGroq
from langgraph.constants import END
from langgraph.graph import StateGraph
from langgraph.prebuilt import create_react_agent
from langchain.agents import create_agent
from agent.prompts import *
from agent.states import *
from agent.tools import write_file, read_file, get_current_directory, list_files
import os

_ = load_dotenv()

# set_debug(True)
# set_verbose(True)
#
llm1 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY1") )
llm2 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY2") )
llm3 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY3") )
llm4 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY4") )
llm5 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY5") )
llm6 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY6") )
llm7 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY7") )
llm8 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY8") )
llm9 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY9") )
llm10 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY10"))
llm11 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY11") )
llm12 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY12") )
llm13 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY13") )
llm14 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY14") )
llm15 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY15") )
llm16 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY16") )
llm17 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY17") )
llm18 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY18") )
llm19 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY19") )
llm20 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY20") )



def planner_agent(state: dict) -> dict:
    """Planner: Converts user prompt into a structured Plan using multiple LLMs."""
    user_prompt = state["user_prompt"]
    prompt = planner_prompt(user_prompt)
    plan = invoke_with_llms_for_planner(prompt, Plan)
    return {"plan": plan}


def architect_agent(state: dict) -> dict:
    """Architect: Creates TaskPlan from Plan using multiple LLMs."""
    plan: Plan = state["plan"]
    prompt = architect_prompt(plan=plan.model_dump_json())
    task_plan = invoke_with_llms_for_architect(prompt, TaskPlan)
    task_plan.plan = plan
    print(task_plan.model_dump_json())
    return {"task_plan": task_plan}


def coder_agent(state: dict) -> dict:
    """LangGraph tool-using coder agent."""
    coder_state: CoderState = state.get("coder_state")
    if coder_state is None:
        coder_state = CoderState(task_plan=state["task_plan"], current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx >= len(steps):
        return {"coder_state": coder_state, "status": "DONE"}

    print("sumanvitha: currently working at step index:", coder_state.current_step_idx)
    current_task = steps[coder_state.current_step_idx]
    print("sumanvitha: current task:", current_task)
    existing_content = read_file.run(current_task.filepath)

    system_prompt = coder_system_prompt()
    user_prompt = (
        f"Task: {current_task.task_description}\n"
        f"File: {current_task.filepath}\n"
        f"Existing content:\n{existing_content}\n"
        "Use write_file(path, content) to save your changes."
    )

    coder_tools = [write_file, read_file, get_current_directory, list_files]
    invoke_with_llms_for_coder(system_prompt, user_prompt, coder_tools)

    coder_state.current_step_idx += 1
    print("sumanvitha: completed step index:", coder_state.current_step_idx - 1)
    return {"coder_state": coder_state}



def invoke_with_llms_for_planner(prompt: str, output_model) -> object:
    """Handles LLM invocation and switching logic for planner agent."""
    current_llm = llm1  # Start with the first LLM

    while True:
        try:
            response = current_llm.with_structured_output(output_model).invoke(prompt)
            if response is None:
                raise ValueError("LLM did not return a valid response for planner.")
            return response
        except Exception as e:
            print(f"Error invoking planner agent with current llm, switching to next LLM...", e)
            if current_llm == llm1:
                current_llm = llm2
            elif current_llm == llm2:
                current_llm = llm3
            elif current_llm == llm3:
                current_llm = llm4
            elif current_llm == llm4:
                current_llm = llm5
            elif current_llm == llm5:
                current_llm = llm6
            elif current_llm == llm6:
                current_llm = llm7
            elif current_llm == llm7:
                current_llm = llm8
            elif current_llm == llm8:
                current_llm = llm9
            elif current_llm == llm9:
                current_llm = llm10
            elif current_llm == llm10:
                current_llm = llm11
            elif current_llm == llm11:
                current_llm = llm12
            elif current_llm == llm12:
                current_llm = llm13
            elif current_llm == llm13:
                current_llm = llm14
            elif current_llm == llm14:
                current_llm = llm15
            elif current_llm == llm15:
                current_llm = llm16
            elif current_llm == llm16:
                current_llm = llm17
            elif current_llm == llm17:
                current_llm = llm18
            elif current_llm == llm18:
                current_llm = llm19
            elif current_llm == llm19:
                current_llm = llm20
            elif current_llm == llm20:
                raise RuntimeError("All LLMs failed.")


def invoke_with_llms_for_architect(prompt: str, output_model) -> object:
    """Handles LLM invocation and switching logic for architect agent."""
    current_llm = llm1  # Start with the first LLM

    while True:
        try:
            response = current_llm.with_structured_output(output_model).invoke(prompt)
            if response is None:
                raise ValueError("LLM did not return a valid response for architect.")
            return response
        except Exception as e:
            print(f"Error invoking architect agent with current llm, switching to next LLM...", e)
            if current_llm == llm1:
                current_llm = llm2
            elif current_llm == llm2:
                current_llm = llm3
            elif current_llm == llm3:
                current_llm = llm4
            elif current_llm == llm4:
                current_llm = llm5
            elif current_llm == llm5:
                current_llm = llm6
            elif current_llm == llm6:
                current_llm = llm7
            elif current_llm == llm7:
                current_llm = llm8
            elif current_llm == llm8:
                current_llm = llm9
            elif current_llm == llm9:
                current_llm = llm10
            elif current_llm == llm10:
                current_llm = llm11
            elif current_llm == llm11:
                current_llm = llm12
            elif current_llm == llm12:
                current_llm = llm13
            elif current_llm == llm13:
                current_llm = llm14
            elif current_llm == llm14:
                current_llm = llm15
            elif current_llm == llm15:
                current_llm = llm16
            elif current_llm == llm16:
                current_llm = llm17
            elif current_llm == llm17:
                current_llm = llm18
            elif current_llm == llm18:
                current_llm = llm19
            elif current_llm == llm19:
                current_llm = llm20
            elif current_llm == llm20:
                raise RuntimeError("All LLMs failed.")


def invoke_with_llms_for_coder(system_prompt: str, user_prompt: str, coder_tools: list) -> None:
    """Handles LLM invocation and switching logic."""
    current_llm = llm1  # Start with the first LLM

    while True:
        try:
            react_agent = create_react_agent(current_llm, coder_tools)
            react_agent.invoke({"messages": [{"role": "system", "content": system_prompt},
                                             {"role": "user", "content": user_prompt}]})
            break
        except Exception as e:
            print(f"Error creating react agent with , switching to next LLM...", e)
            if current_llm == llm1:
                current_llm = llm2
            elif current_llm == llm2:
                current_llm = llm3
            elif current_llm == llm3:
                current_llm = llm4
            elif current_llm == llm4:
                current_llm = llm5
            elif current_llm == llm5:
                current_llm = llm6
            elif current_llm == llm6:
                current_llm = llm7
            elif current_llm == llm7:
                current_llm = llm8
            elif current_llm == llm8:
                current_llm = llm9
            elif current_llm == llm9:
                current_llm = llm10
            elif current_llm == llm10:
                current_llm = llm11
            elif current_llm == llm11:
                current_llm = llm12
            elif current_llm == llm12:
                current_llm = llm13
            elif current_llm == llm13:
                current_llm = llm14
            elif current_llm == llm14:
                current_llm = llm15
            elif current_llm == llm15:
                current_llm = llm16
            elif current_llm == llm16:
                current_llm = llm17
            elif current_llm == llm17:
                current_llm = llm18
            elif current_llm == llm18:
                current_llm = llm19
            elif current_llm == llm19:
                current_llm = llm20
            elif current_llm == llm20:
                raise RuntimeError("All LLMs failed.")


graph = StateGraph(dict)

graph.add_node("planner", planner_agent)
graph.add_node("architect", architect_agent)
graph.add_node("coder", coder_agent)

graph.add_edge("planner", "architect")
graph.add_edge("architect", "coder")
graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.get("status") == "DONE" else "coder",
    {"END": END, "coder": "coder"}
)

graph.set_entry_point("planner")
agent = graph.compile()
if __name__ == "__main__":
    result = agent.invoke({"user_prompt": "Build a colourful modern todo app in html css and js"},
                          {"recursion_limit": 100})
    print("Final State:", result)



# #check if a model can be invoked
# response = llm.invoke("what is name and age of  Mother teresa?")
# print(response.content)
#
# #we can also get structured output using pydantic models
# class Person(BaseModel):
#     name: str
#     age: int
#
# response1 =llm.with_structured_output(Person).invoke("Get name and age of ram fro below data: name of ram is ram kumar and age is 30")
# print(response1)

#this file has code for states flow.


