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
llm = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY") )
llm2 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY2") )
llm3 = ChatGroq(model="openai/gpt-oss-120b", groq_api_key = os.getenv("GROQ_API_kEY3") )

def planner_agent(state: dict) -> dict:
    """Converts user prompt into a structured Plan."""
    user_prompt = state["user_prompt"]
    resp = llm.with_structured_output(Plan).invoke(
        planner_prompt(user_prompt)
    )
    if resp is None:
        raise ValueError("Planner did not return a valid response.")
    return {"plan": resp}


def architect_agent(state: dict) -> dict:
    """Creates TaskPlan from Plan."""
    plan: Plan = state["plan"]
    resp = llm.with_structured_output(TaskPlan).invoke(
        architect_prompt(plan=plan.model_dump_json())
    )
    if resp is None:
        raise ValueError("Architect did not return a valid response.")

    resp.plan = plan
    print(resp.model_dump_json())
    return {"task_plan": resp}



def call_llm_invoke_with2llms(llm, coder_tools):
    react_agent = create_react_agent(llm, coder_tools)

    react_agent.invoke({"messages": [{"role": "system", "content": system_prompt},
                                     {"role": "user", "content": user_prompt}]})



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
    current_llm = llm  # Start with the first LLM

    while True:
        try:
            react_agent = create_react_agent(current_llm, coder_tools)
            react_agent.invoke({"messages": [{"role": "system", "content": system_prompt},
                                             {"role": "user", "content": user_prompt}]})
            break
        except Exception as e:
            print(f"Error creating react agent with , switching to next LLM...", e)
            if current_llm == llm:
                current_llm = llm2  # Switch to llm2
            elif current_llm == llm2:
                current_llm = llm3  # Switch to llm3
            elif current_llm == llm3:
                raise RuntimeError("All LLMs failed.")  # Stop if all LLMs fail

    coder_state.current_step_idx += 1
    print("sumanvitha: completed step index:", coder_state.current_step_idx - 1);
    return {"coder_state": coder_state}


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


