from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json, time, urllib.request, urllib.error

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

LLM_URL = "http://localhost:3002/v1/chat/completions"


class AskRequest(BaseModel):
    question: str


def call_llm(question: str, retries: int = 3, timeout: float = 5.0) -> str:
    """Call the fake LLM, retrying the ~10% random 500s with a small backoff."""
    payload = json.dumps({
        "model": "fake-llm-1",
        "messages": [{"role": "user", "content": question}],
    }).encode()
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(
                LLM_URL, data=payload, headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                data = json.load(resp)
                return data["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            last_err = f"HTTP {e.code}"
        except Exception as e:
            last_err = str(e)
        time.sleep(0.3 * attempt)  # backoff before the next try
    raise RuntimeError(f"LLM failed after {retries} tries: {last_err}")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ask")
def ask(req: AskRequest):
    try:
        return {"answer": call_llm(req.question)}
    except RuntimeError as e:
        return {"error": str(e)}
