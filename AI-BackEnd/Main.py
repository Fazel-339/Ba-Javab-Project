from fastapi import FastAPI, HTTPException, Body
from Services.openai_service import OpenAIService
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from Config import Settings

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ایجاد سرویس با کلید API از تنظیمات
openai_service = OpenAIService(Settings.OPENAI_API_KEY)


@app.post("/generate-answer")
async def generate_answer(data: dict = Body(...)):
    try:
        prompt = data.get('prompt')
        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")

        response = openai_service.generate_response(prompt)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)