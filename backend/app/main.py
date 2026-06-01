from fastapi import FastAPI

app = FastAPI(title="AI Scientific Calculator", version="0.1.0")

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai-scientific-calculator"}
