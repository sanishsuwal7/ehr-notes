from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
import json
import os
import tempfile
import subprocess
import whisper
import re

app = FastAPI()
notes_file = "notes.json"

# Load notes from JSON file if exists
if os.path.exists(notes_file):
    try:
        with open(notes_file, "r") as f:
            content = f.read().strip()
            notes = json.loads(content) if content else []
    except json.JSONDecodeError:
        notes = []
        print("Error decoding JSON, starting with an empty note list.")
else:
    notes = []

# CORS setup to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoteInput(BaseModel):
    patient_id: str
    patient_name: str
    subjective: str
    objective: str
    assessment: str
    plan: str

@app.post("/notes")
def add_note(note: NoteInput):
    note_id = str(uuid.uuid4())
    new_note = note.model_dump()
    new_note["id"] = note_id
    notes.append(new_note)
    with open(notes_file, "w") as f:
        json.dump(notes, f, indent=2)
    return {"id": note_id, "note": new_note}

@app.get("/notes")
def get_notes():
    return notes

@app.post("/transcribe")
def transcribe_audio(file: UploadFile = File(...)):
    # upload_dir = "recordings"
    # os.makedirs(upload_dir, exist_ok=True)

    # file_path = os.path.join(upload_dir, file.filename)
    # with open(file_path, "wb") as buffer:
    #     buffer.write(file.file.read())

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(file.file.read())
        temp_audio_path = temp_audio.name
    
    model = whisper.load_model("base")
    result = model.transcribe(temp_audio_path)
    transcript = result["text"]

    def extract_between(text, start_label, end_label):
        pattern = re.compile(rf"{start_label}\s*:?\s*(.*?){end_label}\s*:?", re.IGNORECASE | re.DOTALL)
        match = pattern.search(text)
        return match.group(1).strip() if match else ""

    def extract_from_label(text, label):
        pattern = re.compile(rf"{label}\s*:?\s*(.*)", re.IGNORECASE | re.DOTALL)
        match = pattern.search(text)
        return match.group(1).strip() if match else ""

    subjective = extract_between(transcript, "Subjective", "Objective")
    objective = extract_between(transcript, "Objective", "Assessment")
    assessment = extract_between(transcript, "Assessment", "Plan")
    plan = extract_from_label(transcript, "Plan")

    new_note = {
        "subjective": subjective,
        "objective": objective,
        "assessment": assessment,
        "plan": plan
    }

    return {"transcript": transcript, "note": new_note}
