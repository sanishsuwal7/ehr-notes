from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
import json
import os

app = FastAPI()
notes_file = "notes.json"

# Load notes from JSON file if exists
if os.path.exists(notes_file):
    try:
        with open(notes_file, "r") as f:
            content = f.read().strip()
            notes = json.load(content) if content else []
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
    new_note = note.dict()
    new_note["id"] = note_id
    notes.append(new_note)
    with open(notes_file, "w") as f:
        json.dump(notes, f, indent=2)
    return {"id": note_id, "note": new_note}

@app.get("/notes")
def get_notes():
    return notes