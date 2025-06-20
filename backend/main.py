from fastapi import FastAPI
from pydantic import BaseModel
import uuid

app = FastAPI()
notes = []

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
    return {"id": note_id, "note": new_note}

@app.get("/notes")
def get_notes():
    return notes
