import {useRef, useState} from 'react';

export default function RecordPage() {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [note, setNote] = useState(null);
    const mediaRecorderRef = useRef<any>(null);
    const audioChunksRef = useRef<any[]>([]);

    const startRecording = async() => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (e:any) => audioChunksRef.current.push(e.data)
        mediaRecorderRef.current.onstop = async () => {
            const blob = new Blob(audioChunksRef.current, {type:'audio/wav'});
            const formData = new FormData();
            formData.append('file', blob, 'reacording.wav');

            const res = await fetch('http://localhost:8000/transcribe',{
                method:'POST',
                body: formData
            });
            const data = await res.json();
            setTranscript(data.transcript)
            setNote(data.note);
            
        };
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setRecording(true);
    }

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Record a Conversation</h1>
            <div className="mb-4">
                <button
                onClick={recording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-500' : 'bg-blue-600'}`}
                >
                {recording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>

             {transcript && (
                <div className="mt-4">
                <h2 className="text-lg font-semibold">Transcript:</h2>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{transcript}</p>
                </div>
            )}
            {note && (
                <div className="mt-4 border p-4 rounded bg-gray-100">
                <h2 className="font-bold">Generated Note</h2>
                <p><strong>Subjective:</strong> {note.subjective}</p>
                <p><strong>Objective:</strong> {note.objective}</p>
                <p><strong>Assessment:</strong> {note.assessment}</p>
                <p><strong>Plan:</strong> {note.plan}</p>
                </div>
            )}
        </div>
        

    )
}