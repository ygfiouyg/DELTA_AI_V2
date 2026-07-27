"""LLM Loop — V.102 — Native Function Calling"""
import json, sys, os, requests
sys.path.insert(0, os.path.dirname(__file__))
from tools_registry import get_tools_schema, execute_tool

ZAI_PROXY_URL = "http://localhost:3000/api/ai/zai-openai/chat/completions"
DEFAULT_MODEL = "glm-4-flash"
MAX_ITERATIONS = 5

def call_llm(messages, tools=None):
    payload = {"model": DEFAULT_MODEL, "messages": messages, "temperature": 0.7, "max_tokens": 4096, "stream": False}
    if tools:
        payload["tools"] = tools
        payload["tool_choice"] = "auto"
    try:
        r = requests.post(ZAI_PROXY_URL, json=payload, headers={"Content-Type":"application/json"}, timeout=60)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        return {"error": str(e)}

def run_llm_loop(user_message, system_prompt="أنت مساعد ذكي تستخدم الأدوات المتاحة لمساعدة المستخدم.", conversation_history=None):
    tools = get_tools_schema()
    messages = [{"role":"system","content":system_prompt}]
    if conversation_history: messages.extend(conversation_history)
    messages.append({"role":"user","content":user_message})

    for iteration in range(MAX_ITERATIONS):
        result = call_llm(messages, tools)
        if "error" in result:
            yield {"type":"error","message":result["error"]}; return
        choice = result.get("choices",[{}])[0]
        message = choice.get("message",{})
        content = message.get("content","")
        tool_calls = message.get("tool_calls",[])
        if content: yield {"type":"text","content":content}
        if not tool_calls: yield {"type":"done"}; return
        messages.append(message)
        for tc in tool_calls:
            tool_name = tc.get("function",{}).get("name","")
            try: tool_args = json.loads(tc.get("function",{}).get("arguments","{}"))
            except: tool_args = {}
            yield {"type":"tool_start","tool":tool_name,"args":tool_args}
            tool_result = execute_tool(tool_name, tool_args)
            yield {"type":"tool_result","tool":tool_name,"result":tool_result}
            try:
                ro = json.loads(tool_result)
                if "file_url" in ro:
                    yield {"type":"file_generated","filename":ro.get("file_url","").split("/")[-1],"url":ro["file_url"]}
                elif "generated_files" in ro:
                    for fn in ro.get("generated_files",[]):
                        yield {"type":"file_generated","filename":fn,"url":f"/api/file/download/{fn}"}
            except: pass
            messages.append({"role":"tool","tool_call_id":tc.get("id",""),"content":tool_result})
    yield {"type":"error","message":"Max iterations"}

if __name__ == "__main__":
    stdin_input = ""
    if not sys.stdin.isatty():
        try: stdin_input = sys.stdin.read()
        except: pass
    if stdin_input.strip():
        try:
            data = json.loads(stdin_input)
            for event in run_llm_loop(data.get("message",""), data.get("system_prompt","أنت مساعد ذكي تستخدم الأدوات المتاحة."), data.get("conversation_history",[])):
                print(json.dumps(event, ensure_ascii=False), flush=True)
        except Exception as e:
            print(json.dumps({"type":"error","message":str(e)}, ensure_ascii=False), flush=True)
    else:
        print("LLM Loop V.102 — ready")
        print("Tools:", get_tools_schema())
